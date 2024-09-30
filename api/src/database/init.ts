import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function init() {
  const databasePath = path.join(__dirname, "database.db");
  const db = new sqlite3.Database(databasePath);

  const schemaPath = path.join(__dirname, "schema.sql");
  const dataPath = path.join(__dirname, "data.sql");

  const schemaFile = await readFile(schemaPath, "utf-8");
  db.exec(schemaFile);

  const dataFile = await readFile(dataPath, "utf-8");
  db.exec(dataFile);
}

// TODO: Remove this part.
try {
  await init();
} catch (err: any) {
  console.log(err.stack);
}
