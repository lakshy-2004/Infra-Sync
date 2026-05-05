import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/connectDB.js";
import auth from "./routes/auth.js";
import post from "./routes/createPost.js";
import user from "./routes/user.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());

connectDB();

app.use("/api/v1", auth);
app.use("/api/v2", post);
app.use("/api/v3", user);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;