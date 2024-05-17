import express from "express";
import session from "express-session";
import bodyParser from'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './user.js';
import Admin from './admin.js';
import Tech from './tech.js';

export default class App {
  constructor(db) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.db = db.connection;
    this.app = express();

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use(
      session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        // Add other session configurations as needed
      })
    );

    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'login.html'));
    });

    this.app.use('/user', new User(db).router);
    this.app.use('/admin', new Admin(db).router);
    this.app.use('/tech', new Tech(db).router);
    this.app.post('/', async (req, res) => {
        const username = req.body.username;
        const passwd = req.body.passwd;
        const sql = "CALL login(?,?)";
        const getUserIdSql = "CALL getId(?,?)";
      
        try {
          const results = await this.db.query(sql, [username, passwd]);
      
          const message = results[0][0].message;
      
          if (['Data transferred from admin successfully.', 'Data transferred from citizen successfully.', 'Data transferred from rescuer successfully.'].includes(message)) {
            const getUserIdResults = await this.db.query(getUserIdSql, [username, passwd]);
      
            if (getUserIdResults && getUserIdResults.length > 0) {
              const userId = getUserIdResults[0][0].userId;
      
              if (userId) {
                req.session.userId = userId;
      
                if (message === 'Data transferred from admin successfully.') {
                  res.redirect(`/admin`);
                } else if (message === 'Data transferred from citizen successfully.') {
                  res.redirect(`/user`);
                } else {
                  res.redirect(`/tech`);
                }
              } else {
                res.status(401).send('Invalid credentials. Please try again.');
              }
            } else {
              res.status(401).send('User not found.');
            }
          } else {
            res.send(message);
          }
        } catch (err) {
          console.error('Error during login query:', err);
          res.status(500).send('Error occurred during login');
        }
      });
  }
  
    

  listen(port = 8800) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}