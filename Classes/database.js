import mysql from "mysql";

export default class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "admin132002!",
      database: "tech",
    });
  }

  connect() {
    this.connection.connect((err) => {
      if (err) throw err;
      console.log("Connected to the database!");
    });
  }
}