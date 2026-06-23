import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Each test worker imports the db connection singleton once. Pointing it at an
    // in-memory database keeps tests fast and fully isolated from the dev/seed file.
    env: {
      DB_PATH: ':memory:',
    },
    include: ['tests/**/*.test.ts'],
  },
});
