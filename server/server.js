const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    msg: "Hello world my project asdasd",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
