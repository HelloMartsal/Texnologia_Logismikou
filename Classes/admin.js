import Account from './account.js';

export default class Admin extends Account {
  constructor(db) {
    super(db);
    this.isAdmin = this.isAdmin.bind(this);
    this.router.get('/', this.isAuthenticated, this.isAdmin, this.isLogged, (req, res) => {
      res.send('Welcome admin!');
    });
  }

  async isAdmin(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    try {
        const results = await db.query('SELECT username_a FROM admin WHERE username_a = ?', [userId]);
        if (results.length > 0) {
            // User is an admin based on the query results
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