import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false }
});

export async function query(text: string, params?: any[]) {
  const result = await pool.query(text, params);
  return result;
}
