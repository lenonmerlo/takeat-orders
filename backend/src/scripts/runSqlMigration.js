import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const relativeSqlPath = process.argv[2];

  if (!relativeSqlPath) {
    throw new Error("Informe o caminho do arquivo SQL. Ex: migrations/file.up.sql");
  }

  const projectRoot = path.resolve(__dirname, "..", "..");
  const sqlPath = path.resolve(projectRoot, relativeSqlPath);
  const sql = await readFile(sqlPath, "utf8");

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log(`Migration executada com sucesso: ${relativeSqlPath}`);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Falha ao executar migration SQL:", error.message);
  process.exit(1);
});
