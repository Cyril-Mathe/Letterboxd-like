import express from 'express';
import cors from 'cors';
// import routes from "./routes/routes.js";
// import connectDB from "./database/dbConnect.js";

const app = express();
const port = 3000;

// connectDB();

app.use(cors())

app.use(express.json());

// app.use("/api/v1", routes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});