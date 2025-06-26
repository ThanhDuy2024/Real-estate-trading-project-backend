import 'dotenv/config'
import express from "express";
import cookieParser from "cookie-parser";
import * as database from "./config/database";
const port = String(process.env.PORT);
const app = express();
database.databaseConnect();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//userName: thanhduyuth
//password: FD7LOKfcRWFwJ2HR