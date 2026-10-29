import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Needed when running behind Netlify/Render proxies (secure cookies)
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.URL, // set automatically by Netlify
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("Backend is running"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend is running." });
});

app.use("/api/auth", authRoutes);

// Catch-all error handler: logs the real error, hides details from the client
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Something went wrong." });
});

// Start the server only when run directly (npm run dev / npm start),
// not when imported by the Netlify function.
// Start the server only when running locally (npm run dev / npm start),
// not inside the Netlify function.
const isServerless = Boolean(
  process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY
);

if (!isServerless) {
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