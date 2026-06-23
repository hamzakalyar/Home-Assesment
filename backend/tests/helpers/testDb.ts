import { db } from '../../src/db/connection';
import { resetSchema } from '../../src/db/schema';

/**
 * Resets the in-memory test database to a clean, empty schema. Call this in a
 * `beforeEach` so every test starts from a known state. The connection points at
 * an in-memory database (configured in vitest.config.ts), so this is fast and
 * never touches the dev data file.
 */
export function resetDatabase(): void {
  resetSchema(db);
}
