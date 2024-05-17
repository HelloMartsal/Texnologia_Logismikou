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

  isLogged(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    // Query the database to check if the user ID belongs to an admin
    this.db.query('SELECT username FROM log WHERE username = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching  users IDs:', err);
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