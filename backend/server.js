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
"http://localhost:5174",
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

const isDirectExecution =
process.argv[1] &&
import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, "/")}`).href;

if (isDirectExecution) {
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
