import account_router from './account.js';

export default class tech_router extends account_router {
    constructor(db) {
        super(db);
      
        this.isTech = this.isTech.bind(this);
      
        this.router.get('/', this.isAuthenticated, this.isTech, this.isLogged, (req, res) => {
          res.send('Welcome tech!');
        });
      }
      async isTech(req, res, next) {
        const userId = req.session.userId; // Get the user ID from the session
      
        try {
            const results = await this.db.query('SELECT username_t FROM tech WHERE username_t = ?', [userId]);
            if (results.length > 0) {
                // User is a tech based on the query results
                return next();
            } else {
                res.status(401).send('Unauthorized. Insufficient permissions.');
            }
        } catch (err) {
            console.error('Error fetching tech user IDs:', err);
            res.status(500).send('Error occurred.');
        }
    }
}