import express from 'express';

export default class Account {
  constructor(db) {
    this.router = express.Router();
    this.db = db.connection;
    this.isLogged = this.isLogged.bind(this);
  }

  isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
      } else {
        // User is not authenticated, redirect them to the login page or send an authentication error
        res.status(401).send('Unauthorized. Please log in.');
      }
  }

  async isLogged(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session

    try {
        // Query the database to check if the user ID belongs to an admin
        const [results] = await this.db.query('SELECT username FROM log WHERE username = ?', [userId]);
        

        if (results.username) {
            // User is an admin based on the query results
            return next();
        } else {
            res.status(401).send('Unauthorized. Insufficient permissions.');
        }
    } catch (err) {
        console.error('Error fetching  users IDs:', err);
        res.status(500).send('Error occurred.');
    }
  }
}