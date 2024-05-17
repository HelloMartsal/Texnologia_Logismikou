import Database from './Classes/database.js';
import App from './Classes/app.js';

const db = new Database();
db.connect();

const app = new App(db);
app.listen(8800); 