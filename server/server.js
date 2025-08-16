import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/database.js";
import authRouter from "./routes/auth.routes.js";


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

const TOKEN = process.env.MAILTRAP_TOKEN;
app.get("/", (req, res) => {
  res.json({
    msg: TOKEN,
  });
});

// Auth apis
app.use("/api", authRouter);

connectDB().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Cannot connect to the server");
  }
});

