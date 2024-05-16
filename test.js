import express from "express";
import mysql from "mysql";

const app = express();
app.listen(8800, () => {
  console.log("Server is running on port 8800");
})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin132002!",
    database: "tech"
})


app.get("/", (req, res) => {
    db.query("SELECT * FROM specialty", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})
