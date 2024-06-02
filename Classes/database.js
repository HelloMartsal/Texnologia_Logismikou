import mysql from "mysql";
import { promisify } from "util";

export default class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "olokliro",
    });

    // Promisify the query method
    this.connection.query = promisify(this.connection.query);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database!');
          return reject(err);
        }
        console.log('Connected to the database!');
        resolve(this.connection);
      });
    });
  }
}