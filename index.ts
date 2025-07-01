import 'dotenv/config'
import express from "express";
import cookieParser from "cookie-parser";
import * as database from "./config/database";
import adminApi from "./routes/admin/index.route";

const port = String(process.env.PORT);
const app = express();
database.databaseConnect();

app.use(express.json());
app.use(cookieParser());

app.use('/api/admin', adminApi);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})