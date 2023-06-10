const express = require("express");
require("dotenv").config();
const app = express();
const connection = require("./config/db");
const userRouter = require("./routes/user.router");
const noteRouter = require("./routes/note.router");
app.use(express.json());
app.use("/user", userRouter);
app.use("/note", noteRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log(`server is running on port ${process.env.port}`);
  } catch (error) {
    console.log(error);
  }
});
