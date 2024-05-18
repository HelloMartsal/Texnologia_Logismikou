import Account from './account.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class User extends Account {
  constructor(db) {
    super(db);
    this.isUser = this.isUser.bind(this);

    this.router.get('/', this.isAuthenticated, this.isUser, this.isLogged, (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'main_page.html'));
    });
    
  }

  async isUser(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    try {
        const results = await this.db.query('SELECT username_u FROM user WHERE username_u = ?', [userId]);
        if (results.length > 0) {
            // User is an admin based on the query results
            //res.send(`Admin ID: ${userId}`);
            return next();
        } else {
            res.status(401).send('Unauthorized. Insufficient permissions.');
        }
    } catch (err) {
        console.error('Error fetching admin user IDs:', err);
        res.status(500).send('Error occurred.');
    }
    }
}