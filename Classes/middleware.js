import express from 'express';

export default class middleware {
  constructor(db) {
    this.router = express.Router();
    this.db = db.connection;
    this.isLogged = this.isLogged.bind(this);
    this.isUser = this.isUser.bind(this);
    this.isTech = this.isTech.bind(this);
  }

  isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
      } else {
        res.status(401).send('Unauthorized. Please log in.');
      }
  }

  async isLogged(req, res, next) {
    const userId = req.session.userId; 

    try {
        const [results] = await this.db.query('SELECT username FROM log WHERE username = ?', [userId]);
        

        if (results.username) {
            return next();
        } else {
            res.status(401).send('Unauthorized. Insufficient permissions.');
        }
    } catch (err) {
        console.error('Error fetching  users IDs:', err);
        res.status(500).send('Error occurred.');
    }
  }
  async isUser(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    try {
        const results = await this.db.query('SELECT username_u FROM user WHERE username_u = ?', [userId]);
        if (results.length > 0) {
            return next();
        } else {
            res.status(401).send('Unauthorized. Insufficient permissions.');
        }
    } catch (err) {
        console.error('Error fetching admin user IDs:', err);
        res.status(500).send('Error occurred.');  
    }
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


