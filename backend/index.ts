import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from "./src/routes/routes.ts";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});