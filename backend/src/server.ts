import { createApp } from './app';
import { config } from './config';
// Importing the connection here ensures the database file and schema exist before
// the server begins accepting requests.
import './db/connection';

const app = createApp();

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
