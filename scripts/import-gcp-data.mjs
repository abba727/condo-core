import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { Storage } from "@google-cloud/storage";

const artifactsDir = path.resolve(process.env.MIGRATION_EXPORT_DIR ?? "migration-artifacts");
const targetUrl = process.env.TARGET_DATABASE_URL ?? process.env.DATABASE_URL;
const bucketName = process.env.GCS_BUCKET;

if (!targetUrl) throw new Error("TARGET_DATABASE_URL or DATABASE_URL is required");
if (!bucketName) throw new Error("GCS_BUCKET is required");

const safeTable = (name) => {
  if (!/^[A-Za-z0-9_]+$/.test(name)) throw new Error(`Invalid table name: ${name}`);
  return name;
};

const safeKey = (key) => {
  const normalized = String(key ?? "").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) throw new Error(`Invalid storage key: ${key}`);
  return normalized;
};

const toMysqlDateTime = (_column, value) => {
  if (typeof value !== "string") return value;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return value;
  return value.replace("T", " ").replace(/\.\d{3}Z$/, "").replace("Z", "");
};

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(artifactsDir, "source-db.json"), "utf8"));
  const connection = await mysql.createConnection(targetUrl);
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");

  for (const [rawName, rows] of Object.entries(manifest.tables)) {
    const tableName = safeTable(rawName);
    await connection.query(`DELETE FROM \`${tableName}\``);
    for (const row of rows) {
      const columns = Object.keys(row);
      if (!columns.length) continue;
      const placeholders = columns.map(() => "?").join(", ");
      const quotedColumns = columns.map((column) => `\`${column}\``).join(", ");
      await connection.query(
        `INSERT INTO \`${tableName}\` (${quotedColumns}) VALUES (${placeholders})`,
        columns.map((column) => toMysqlDateTime(column, row[column]))
      );
    }
  }
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  await connection.end();

  const unavailable = new Set((manifest.missingStorageKeys ?? []).map(({ key }) => key));
  if (process.env.SKIP_STORAGE_UPLOAD !== "1") {
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    for (const rawKey of manifest.storageKeys) {
      const key = safeKey(rawKey);
      if (unavailable.has(key)) continue;
      const localFile = path.join(artifactsDir, "files", key);
      await bucket.upload(localFile, { destination: key, resumable: false });
    }
  }
  console.log(`Import complete: ${Object.keys(manifest.tables).length} tables and ${manifest.storageKeys.length - unavailable.size} storage objects`);
}

main().catch((error) => { console.error(error); process.exit(1); });
