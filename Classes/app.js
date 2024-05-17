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
      res.sendFile(__dirname + '/login.html');
    });

    this.app.use('/user', new User(db).router);
    this.app.use('/admin', new Admin(db).router);
    this.app.use('/tech', new Tech(db).router);
  }

  listen(port = 8800) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}