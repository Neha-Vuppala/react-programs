import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Backend is running.",
  });
});

app.use("/api/auth", authRoutes);
console.log("Runtime environment:", {
  NODE_ENV: process.env.NODE_ENV,
  NETLIFY: process.env.NETLIFY,
});
if (
  !process.env.NETLIFY &&
  process.env.NODE_ENV !== "production"
) {
  const startServer = async () => {
    try {
      await pool.query("SELECT 1");
      console.log("MySQL connected successfully.");

      app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Failed to connect to MySQL:", error.message);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
