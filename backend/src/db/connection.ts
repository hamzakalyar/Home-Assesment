import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../config';
import { applySchema } from './schema';

/**
 * The single shared SQLite connection for the process. Repositories are the only
 * modules that import this — controllers and services must never touch it directly.
 *
 * The schema is applied on first connection so the app and tests are always usable
 * without a separate migration step.
 */
function createConnection(): Database.Database {
  if (config.dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  }

  const connection = new Database(config.dbPath);
  connection.pragma('journal_mode = WAL');
  connection.pragma('foreign_keys = ON');
  applySchema(connection);

  return connection;
}

export const db = createConnection();
