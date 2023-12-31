const express = require("express");
const dotenv = require("dotenv");
const dbconnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config("././env");

const app = express();

//Middlewares

app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.status(200).send("Ok from server");
});

const PORT = process.env.PORT || 4001;
dbconnect();

app.listen(PORT, () => {
  console.log(`Server Listening on port : ${PORT}`);
});
