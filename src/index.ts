import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()").then(() => {
  console.log("✅ DB connected!");
});
