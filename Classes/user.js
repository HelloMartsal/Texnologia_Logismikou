import Account from './account.js';

export default class User extends Account {
  constructor(db) {
    super(db);

    this.router.get('/', this.isAuthenticated, this.isUser, this.isLogged, (req, res) => {
      res.send('Welcome user!');
    });
    this.isUser = this.isUser.bind(this);
  }

  isUser(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    // Query the database to check if the user ID belongs to an admin
    db.query('SELECT username_u FROM user WHERE username_u = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching admin user IDs:', err);
        res.status(500).send('Error occurred.');
        return;
      }
  
      if (results.length > 0) {
        // User is an admin based on the query results
        //res.send(`Admin ID: ${userId}`);
        return next();
      } else {
        res.status(401).send('Unauthorized. Insufficient permissions.');
      }
    });
  }
}