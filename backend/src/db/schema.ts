import type Database from 'better-sqlite3';

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS customers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    phone      TEXT    NOT NULL,
    createdAt  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    price      REAL    NOT NULL,
    stock      INTEGER NOT NULL,
    createdAt  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`;

/** Creates the application tables if they do not already exist. */
export function applySchema(db: Database.Database): void {
  db.exec(SCHEMA_SQL);
}

/** Drops and recreates all tables — used by the test helper for a clean slate. */
export function resetSchema(db: Database.Database): void {
  db.exec('DROP TABLE IF EXISTS customers; DROP TABLE IF EXISTS products;');
  applySchema(db);
}
