import { db } from './connection';

/**
 * Runs `work` inside a single SQLite transaction. If `work` throws, the
 * transaction is rolled back and the error propagates; otherwise it commits and
 * the return value is passed through.
 *
 * Use this whenever a multi-step read-then-write must be atomic (for example, the
 * Task B stock adjustment: read current stock, validate, then update).
 */
export function withTransaction<T>(work: () => T): T {
  return db.transaction(work)();
}
