import express from "express";
import session from "express-session";
import bodyParser from'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import user_router from "./user.js";
import admin_router from "./admin.js";
import tech_router from "./tech.js";

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
      })
    );

    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'login.html'));
    });
    this.app.get("/signup", (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'signup.html'));
    });
    this.app.get('/user',this.isAuthenticated, this.isUser, this.isLogged, (req, res) =>{
      res.sendFile(path.join(__dirname, '..', 'main_page.html'));
    });
  
    this.app.use('/admin', new admin_router(db).router);
    this.app.use('/tech', new tech_router(db).router);
    this.app.post('/', async (req, res) => {
        const username = req.body.username;
        const passwd = req.body.passwd;
        const sql = "CALL login(?,?)";
        const getUserIdSql = "CALL getId(?,?)";
      
        try {
          const results = await this.db.query(sql, [username, passwd]);
      
          const message = results[0][0].message;
      
          if (['Data transferred from admin successfully.', 'Data transferred from user successfully.', 'Data transferred from tech successfully.'].includes(message)) {
            const getUserIdResults = await this.db.query(getUserIdSql, [username, passwd]);
      
            if (getUserIdResults && getUserIdResults.length > 0) {
              const userId = getUserIdResults[0][0].userId;
      
              if (userId) {
                req.session.userId = userId;
      
                if (message === 'Data transferred from admin successfully.') {
                  res.redirect(`/admin`);
                } else if (message === 'Data transferred from user successfully.') {
                  res.redirect(`/user`);
                } else if (message === 'Data transferred from tech successfully.') {
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
      this.app.post('/signup', async (req, res) => {
        const username = req.body.username;
        const passwd = req.body.password;
        const phone = req.body.phone;
        const name = req.body.name;
        const surname = req.body.surname;
        const address = req.body.address;
        const email = req.body.email;
        const date = new Date().toISOString().split('T')[0];      
        const addAccountSql = "CALL addAccount(?,?,?,?,?,?,?,?)";
      
        try {
          const results = await this.db.query(addAccountSql, [username, passwd, phone, name, surname, address, email, date]);
      
          const message = results[0][0].message;
      
          if (message === 'Citizen submitted successfully') {
            res.send('You are submitted');
          } else {
            res.send(message);
          }
        } catch (err) {
          console.error('Error during signup query:', err);
          res.status(500).send('Error occurred during signup');
        }
      });
  }
  
    

  listen(port = 8800) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}