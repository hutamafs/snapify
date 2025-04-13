import pg from "pg";
import * as dotenv from "dotenv";
import express from "express";
import router from "./routes";
const PORT = process.env.PORT || 3000;
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()").then(() => {
  console.log("✅ DB connected!");
});

const app = express();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.use(express.json());
app.use("/api", router);
