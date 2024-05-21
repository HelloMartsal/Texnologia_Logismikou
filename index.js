import express from "express";
import mysql from "mysql";
import path from 'path';
import { fileURLToPath } from 'url';
import session from "express-session";
import bodyParser from'body-parser';
import Database from "./Classes/database.js";
import Tech from "./Classes/tech.js";
import Specialty from "./Classes/specialty.js";
import Service from "./Classes/service.js";
import Review from "./Classes/review.js";
import User from "./Classes/user.js";
import Admin from "./Classes/admin.js";
import Reservations from "./Classes/reservation.js";
import Notifications from "./Classes/notification.js";
import Offers from "./Classes/offer.js";
import Payment from "./Classes/payment.js";
import Account from "./Classes/account.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const database = new Database();
database.connect();
const db = database.connection;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);



// ==================================================== Middleware ===========================================================



function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      // User is authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      res.redirect('/');
      // User is not authenticated, redirect them to the login page or send an authentication error
      //res.status(401).send('Unauthorized. Please log in.');
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
  var user = new User();
  async function populateUser(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
    user = await User.createUser(db,userId);
    next();
  }    

  
 
  var tech = new Tech();
  async function populateTech(req, res, next) {
    const userId = req.session.userId; // Get the user ID from the session
    tech = await Tech.createTech(db,userId);
    next();
  }

  var admin = new Admin();

// ==================================================== Routes ===========================================================


  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });

  app.post('/', async (req, res) => {
    const username = req.body.username;
    const passwd = req.body.passwd;
    const sql = "CALL login(?,?)";
    const getUserIdSql = "CALL getId(?,?)";
  
    try {
      const results = await db.query(sql, [username, passwd]);
  
      const message = results[0][0].message;
  
      if (['Data transferred from admin successfully.', 'Data transferred from user successfully.', 'Data transferred from tech successfully.'].includes(message)) {
        const getUserIdResults = await db.query(getUserIdSql, [username, passwd]);
  
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

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', async (req, res) => {
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
    const results = await db.query(addAccountSql, [username, passwd, phone, name, surname, address, email, date]);

    const message = results[0][0].message;

    if (message === 'Account submitted successfully') {
      res.redirect(`/`);
    } else {
      res.send(message);
    }
  } catch (err) {
    console.error('Error during signup query:', err);
    res.status(500).send('Error occurred during signup');
  }
});


app.get('/user', isAuthenticated, isUser, isLogged,populateUser, (req, res) => {
  
  res.sendFile(__dirname + '/main_page.html');
});
app.get('/',isAuthenticated,isUser,isLogged,(req,res)=>{
  res.sendFile(__dirname + '/main_page.html');
});

app.get('/tech', isAuthenticated, isTech, isLogged, populateTech, (req, res) => {
  
  res.send('Welcome tech!');
});

app.get('/admin', isAuthenticated, isAdmin, isLogged, (req, res) => {
  
  res.send('Welcome admin!');
});

app.get('/logout', isAuthenticated, isLogged, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/find_tech', isAuthenticated, isUser, isLogged, (req, res) => {
  res.sendFile(__dirname + '/find_tech.html');
});
//find a middleware to stop access
app.get('/api/techs', isAuthenticated, isUser, isLogged, async (req, res) => {
  try{
    const specialities = await Specialty.getAllSpecialties(db);
    const services = await Service.getAllServices(db);
    res.json({ data: { specialities, services } });
  } catch (err) {
    console.error('Error fetching specialities and services:', err);
    res.status(500).send('Error occurred');
    }
});
//we cash the techs to avoid multiple queries
let cachedTechs = null;
app.post('/api/techs', isAuthenticated, isUser, isLogged, async (req, res) => {
  if(req.body.called){
    //console.log("called");
    //here we do the filtering and return the techs

  }else {
    try {
      const techs = await Tech.getAllTechs(db);
      cachedTechs = techs;
      res.json({ data: techs });
    } catch (err) {
      console.error('Error fetching techs:', err);
      res.status(500).send('Error occurred');
    }
  }
});

app.get('/booking', isAuthenticated, isUser, isLogged, async (req, res) => {
  res.sendFile(__dirname + '/booking.html');
});

app.get('/api/booking', isAuthenticated, isUser, isLogged, async (req, res) => {
  try {
    const bookings = await Reservations.getBookingHistory(user.username);
    res.json({ data: bookings });
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).send("Error occurred");
  }
});


  
// ===============================================================================================================


app.listen(8800, () => {
  console.log("Connected to backend.");
});
