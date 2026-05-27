import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const tables = ['projects','budget_groups','budget_lines','expenses','contracts','insurances','permits','plan_tasks','vendors'];
for (const t of tables) {
  const [rows] = await conn.execute('SELECT COUNT(*) as cnt FROM ' + t);
  console.log(t + ':', rows[0].cnt);
}
await conn.end();
