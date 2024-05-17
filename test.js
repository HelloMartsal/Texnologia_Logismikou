import Database from './database.js';
import App from './app.js';

const db = new Database();
db.connect();

const app = new App();
app.listen(8800);
