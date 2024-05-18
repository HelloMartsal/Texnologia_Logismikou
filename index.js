import express from "express";
import mysql from "mysql";
import path from 'path';
import { fileURLToPath } from 'url';
import session from "express-session";
import bodyParser from'body-parser';
import Account from "./Account.js";





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    // Add other session configurations as needed
  })
);

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Idrima22",
    database: "findtech",
  });




  app.get("/", (req, res) => {
    res.sendFile(__dirname + '/login.html');
    
});


function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      // User is authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // User is not authenticated, redirect them to the login page or send an authentication error
      res.status(401).send('Unauthorized. Please log in.');
    }
  }


  function isLogged(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    // Query the database to check if the user ID belongs to an admin
    db.query('SELECT username FROM log WHERE username = ?', [userId], (err, results) => {
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


  function isAdmin(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    // Query the database to check if the user ID belongs to an admin
    db.query('SELECT username_a FROM admin WHERE username_a = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching admin user IDs:', err);
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




  function isUser(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    // Query the database to check if the user ID belongs to an admin
    db.query('SELECT username_u FROM user WHERE username_u = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching admin user IDs:', err);
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




  function isTech(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
  
    // Query the database to check if the user ID belongs to an admin
    db.query('SELECT username_t FROM tech WHERE username_t = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching admin user IDs:', err);
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






app.post('/',  (req, res) => {
   

    const username = req.body.username;
    const passwd = req.body.passwd;
    


    const sql = "CALL login(?,?)";
    const getUserIdSql = "CALL getId(?,?)";
    
    
    
   
 
    db.query(sql, [username, passwd], (err, results) => {
      if (err) {
        console.error('Error during login query:', err);
        res.status(500).send('Error occurred during login');
        return;
      }





    
      const message = results[0][0].message;
      

    if (message === 'Data transferred from admin successfully.') {
      db.query(getUserIdSql, [username, passwd], (getUserIdErr, getUserIdResults) => {
        if (getUserIdErr) {
          console.error('Error getting user ID:', getUserIdErr);
          res.status(500).send('Error occurred while getting user ID');
          
          return;
        }

        if (getUserIdResults && getUserIdResults.length > 0) {
          const userId = getUserIdResults[0][0].userId;
          //res.send(`Admin ID: ${userId}`);
         // res.redirect(`/admin/${userId}`); 

          if (userId) {
            req.session.userId = userId;
            res.redirect(`/admin`); // Redirect to admin route with userId
          } else {
            res.status(401).send('Invalid credentials. Please try again.');
          }
        } else {
          res.status(401).send('User not found.');
        }
      });
      
     
        //res.redirect('/admin/:id'); 
    } else if (message === 'Data transferred from citizen successfully.') {
      db.query(getUserIdSql, [username, passwd], (getUserIdErr, getUserIdResults) => {
        if (getUserIdErr) {
          console.error('Error getting user ID:', getUserIdErr);
          res.status(500).send('Error occurred while getting user ID');
          
          return;
        }

        if (getUserIdResults && getUserIdResults.length > 0) {
          const userId = getUserIdResults[0][0].userId;
           

          if (userId) {
            req.session.userId = userId;
            res.redirect(`/user`); // Redirect to citizen route with userId
          } else {
            res.status(401).send('Invalid credentials. Please try again.');
          }
        } else {
          res.status(401).send('User not found.');
        }
      });

        //res.redirect('/citizen');
    } else if (message === 'Data transferred from rescuer successfully.') {
      db.query(getUserIdSql, [username, passwd], (getUserIdErr, getUserIdResults) => {
        if (getUserIdErr) {
          console.error('Error getting user ID:', getUserIdErr);
          res.status(500).send('Error occurred while getting user ID');
          
          return;
        }

        if (getUserIdResults && getUserIdResults.length > 0) {
          const userId = getUserIdResults[0][0].userId;
          

          if (userId) {
            req.session.userId = userId;
            res.redirect(`/tech`); // Redirect to rescuer route with userId
          } else {
            res.status(401).send('Invalid credentials. Please try again.');
          }
        } else {
          res.status(401).send('User not found.');
        }
      });
       // res.redirect('/rescuer');
    } else  {
        res.send(message);
    }
  
    

      
    });

    
  });
  



  app.get('/user', isAuthenticated, isUser, isLogged, (req, res) => {
    const query = 'SELECT username, password, name, surname, address,phone_number, email, date FROM account';
   // res.send('Welcome user!');
   db.query(query, (getUserIdErr, getUserIdResults) => {
    const accounts = results.map(row => new Account(row.username, row.password, row.name, row.surname, row.address,row.phone_umber, row.email, row.date));

    console.log(accounts);
  });
  });

  app.get('/tech', isAuthenticated, isTech, isLogged, (req, res) => {
    
    res.send('Welcome tech!');
  });

  app.get('/admin', isAuthenticated, isAdmin, isLogged, (req, res) => {
    
    const query = 'SELECT username , password, name, surname, address, phone_number, email, dateFROM account';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error occurred while fetching user data');
      return;
    }

    const accounts = results.map(row => new Account(row.username, row.password, row.name, row.surname, row.address, row.phone_number, row.email, row.date));
    console.log(accounts);
    res.json(accounts);
  });
  });



app.listen(8800, () => {
    console.log("Connected to backend.");
  });
