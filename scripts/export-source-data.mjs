import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const outputDir = path.resolve(process.env.MIGRATION_EXPORT_DIR ?? "migration-artifacts");
const sourceUrl = process.env.SOURCE_DATABASE_URL ?? process.env.DATABASE_URL;
const forgeUrl = (process.env.BUILT_IN_FORGE_API_URL ?? "").replace(/\/+$/, "");
const forgeKey = process.env.BUILT_IN_FORGE_API_KEY ?? "";

if (!sourceUrl) throw new Error("SOURCE_DATABASE_URL or DATABASE_URL is required");
if (!forgeUrl || !forgeKey) throw new Error("Source storage credentials are required to export stored files");

const safeKey = (key) => {
  const normalized = String(key ?? "").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) throw new Error(`Invalid storage key: ${key}`);
  return normalized;
};

const gcsRoute = (key) => `/api/files/${encodeURIComponent(safeKey(key)).replace(/%2F/g, "/")}`;

async function getSourceDownloadUrl(key) {
  const url = new URL("v1/storage/presign/get", `${forgeUrl}/`);
  url.searchParams.set("path", key);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${forgeKey}` } });
  if (!response.ok) throw new Error(`Could not presign source file ${key}: ${response.status}`);
  const body = await response.json();
  return body.url;
}

async function main() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(path.join(outputDir, "files"), { recursive: true });

  const connection = await mysql.createConnection(sourceUrl);
  const [tableRows] = await connection.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE' ORDER BY table_name"
  );

  const tables = {};
  const schema = [];
  const storageKeys = new Set([
    "condocore-hero-blueprint_6f2f5977.png",
    "condocore-finance-ledger_2611f913.png",
    "condocore-document-vault_04fdc28d.png",
  ]);

  for (const { table_name: tableName } of tableRows) {
    const [createRows] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
    schema.push(`${createRows[0]["Create Table"]};`);
    const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
    tables[tableName] = rows.map((row) => {
      const next = { ...row };
      if (next.fileKey) {
        storageKeys.add(safeKey(next.fileKey));
        if (next.fileUrl) next.fileUrl = gcsRoute(next.fileKey);
      }
      if (next.receiptKey) {
        storageKeys.add(safeKey(next.receiptKey));
        if (next.receiptUrl) next.receiptUrl = gcsRoute(next.receiptKey);
      }
      return next;
    });
  }
  await connection.end();

  const keys = [...storageKeys].sort();
  const missingStorageKeys = [];
  for (const key of keys) {
    const target = path.join(outputDir, "files", safeKey(key));
    await fs.mkdir(path.dirname(target), { recursive: true });
    try {
      const sourceUrl = await getSourceDownloadUrl(key);
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      missingStorageKeys.push({ key, error: error instanceof Error ? error.message : String(error) });
      console.warn(`Skipping unavailable source file ${key}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const replacer = (_key, value) => typeof value === "bigint" ? value.toString() : value;
  await fs.writeFile(path.join(outputDir, "schema.sql"), `${schema.join("\n\n")}\n`);
  await fs.writeFile(path.join(outputDir, "source-db.json"), JSON.stringify({ tables, storageKeys: keys, missingStorageKeys }, replacer, 2));
  console.log(`Export complete: ${Object.keys(tables).length} tables, ${keys.length - missingStorageKeys.length} downloaded objects, and ${missingStorageKeys.length} unavailable references in ${outputDir}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
