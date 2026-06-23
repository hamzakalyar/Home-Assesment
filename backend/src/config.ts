/**
 * Application configuration, resolved from environment variables with sensible
 * defaults. Import `config` anywhere a setting is needed rather than reading
 * `process.env` directly.
 */
export const config = {
  port: Number(process.env.PORT ?? 4000),
  dbPath: process.env.DB_PATH ?? './data/app.db',
} as const;
