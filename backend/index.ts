import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import routes from "./src/routes/routes.ts";
import { specs } from './src/swagger.ts';
import { areMutualFollowers, saveMessage } from './src/controllers/User/chat.ts';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));

app.use("/api/v1", routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    socket.data.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

const getRoomName = (userId: number, friendId: number) => {
  return userId < friendId ? `${userId}_${friendId}` : `${friendId}_${userId}`;
};

io.on('connection', (socket) => {
  const userId = socket.data.userId;

  socket.on('join', async ({ friendId }) => {
    if (!friendId || Number.isNaN(Number(friendId))) {
      return socket.emit('error', 'Invalid friend id');
    }

    const idFriend = Number(friendId);
    const mutual = await areMutualFollowers(userId, idFriend);
    if (!mutual) {
      return socket.emit('error', 'Users must follow each other to chat');
    }

    const roomName = getRoomName(userId, idFriend);
    socket.join(roomName);
    socket.emit('joined', { room: roomName, friendId: idFriend });
  });

  socket.on('message', async ({ friendId, content }) => {
    if (!friendId || Number.isNaN(Number(friendId)) || !content || !content.trim()) {
      return;
    }

    const idFriend = Number(friendId);
    const mutual = await areMutualFollowers(userId, idFriend);
    if (!mutual) {
      return socket.emit('error', 'Users must follow each other to chat');
    }

    const roomName = getRoomName(userId, idFriend);
    const message = await saveMessage(userId, idFriend, content.trim());
    io.to(roomName).emit('message', {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      createdAt: message.createdAt,
    });
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});