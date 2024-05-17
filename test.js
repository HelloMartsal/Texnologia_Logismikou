import Database from './Classes/database.js';
import App from './Classes/app.js';

const db = new Database();
db.connect();
db.connection.query('SELECT * FROM tech', (err, results) => {
    if (err) {
        console.error('Error fetching user data:', err);
        return;
    }
    
    console.log('User data:', results);
    });
const app = new App(db);
app.listen(8800); 