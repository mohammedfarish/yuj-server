import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Moment from "moment-timezone";

import pingRouter from "./routes/ping";
import authRouter from "./routes/auth/auth";
import userRouter from "./routes/user/user";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use("/v1/ping", pingRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

app.listen(port, async () => {
  // await dbConnect().then(() => console.log("Connected to DB"));
  console.log(
    `Listening on ${port} - ${Moment().tz("Asia/Dubai").format("DD MMM YYYY hh:mm:ss A")}`
  );
});
