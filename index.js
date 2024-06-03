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
import { type } from "os";




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
    const mess = await Account.login(db, username, passwd);
    req.session.userId = mess[1];
    if (mess[0] === 'Data transferred from admin successfully.') {
      res.redirect(`/admin`);
    } else if (mess[0] === 'Data transferred from user successfully.') {
      res.redirect(`/user`);
    } else if (mess[0] === 'Data transferred from tech successfully.') {
      res.redirect(`/tech`);
    } else {
      res.redirect('/');
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
  const mess = await User.signupUser(db, username, passwd, name, surname, address, phone, email, date);
  console.log(mess);
  if (mess === 'Account submitted successfully') {
    res.redirect('/');
  } else {
    res.send(mess);
    res.status(500).send('Error occurred during signup');
  }
});


app.get('/user', isAuthenticated, isUser, isLogged,populateUser, (req, res) => {
  
  res.sendFile(__dirname + '/main_page.html');
});

app.get('/tech', isAuthenticated, isTech, isLogged, populateTech, (req, res) => {
  
  res.sendFile(__dirname + '/main_page_tech.html');
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
    const { priceRange, reviewRange, specialities, services } = req.body;
    req.session.specialities = specialities;
    req.session.services = services;
    const filterdTechs = await Tech.filterTechs(specialities, services, reviewRange, priceRange,cachedTechs);
    res.json({ data: filterdTechs });
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
    const bookings = await Reservations.getUserBookingHistory(db,user.username);
    res.json({ data: bookings });
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).send("Error occurred");
  }
});

app.get('/calendar', isAuthenticated, isTech, isLogged, async (req, res) => {
  res.sendFile(__dirname + '/calendar.html');
});

app.get('/api/calendar', isAuthenticated, isTech, isLogged, async (req, res) => {
  try {
    const availabity =await tech.getAvailability(db);
    res.json({ data: availabity });
  } catch (err) {
    console.error("Error fetching calendar:", err);
    res.status(500).send("Error occurred");
  }
});
app.post('/api/calendar', isAuthenticated, isTech, isLogged, async (req, res) => {
  const events = req.body;
  try {
    await tech.setAvailability(db, events);
  } catch (err) {
    console.error("Error setting availability:", err);
    res.status(500).send("Error occurred");
  }
});

app.get('/api/tech_calendar', isAuthenticated, isUser, isLogged, async (req, res) => {
  try {
    const tech = await Tech.createTech(db,req.session.techId);
    const availabity =await tech.getAvailability(db);
    res.json({ data: availabity });
  } catch (err) {
    console.error("Error fetching calendar:", err);
    res.status(500).send("Error occurred");
  }
});
app.get('/tech/:username', isAuthenticated, isUser, isLogged, async (req, res) => {
  const techId = req.params.username;
  req.session.techId = techId;
  res.sendFile(__dirname + '/tech_reserv.html');
});

app.get('/techInfo/:username', isAuthenticated, isUser, isLogged, async (req, res) => {
  try {
    const tech = await Tech.createTech(db,req.session.techId);
    const TechAccInfo = await tech.getTechAccInfo(db);
    res.json({ data: TechAccInfo });
  } catch (err) {
    console.error("Error fetching Technician's Account Info:", err);
    res.status(500).send("Error occurred");
  }
});

app.get('/techReviews/:username', isAuthenticated, isUser, isLogged, async (req, res) => {
  try {
    const tech = await Tech.createTech(db,req.session.techId);
    const TechAccInfo = await tech.getReviews(db);
    console.log(TechAccInfo);
    res.json({ data: TechAccInfo });
  } catch (err) {
    console.error("Error fetching Technician's Account Info:", err);
    res.status(500).send("Error occurred");
  }
});


app.get("/user/account", isAuthenticated, isUser, isLogged, async (req, res) => {
  res.sendFile(__dirname + '/account.html');
  
});
app.get("/user/accountinfo", (req, res) => {
    res.json({ data: user });   
 });

 app.post('/user/updateinfo',isAuthenticated, isUser, isLogged, async (req, res) => {
  let { field, value } = req.body;
  const updated = await user.updateUserColumn(db,field, value);
  field = updated.field;
  value = updated.value;
  res.json({ field, value });
});

app.get('/techbooking', isAuthenticated, isTech, isLogged, async (req, res) => {
  res.sendFile(__dirname + '/techbooking.html');
});
app.get('/api/techbooking', isAuthenticated, isTech, isLogged, async (req, res) => {
  try {
    const bookings = await Reservations.getTechBookingHistory(db,tech.username);
    res.json({ data: bookings });
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).send("Error occurred");
  }
});
app.post('/api/create-notification', async (req, res) => {
  const { userUsername, explanation, price, date } = req.body;
  // Validate notification data
  if (!userUsername || !explanation || !price || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (isNaN(price)) {
    return res.status(400).json({ error: 'Invalid price format' });
  }

  try {
    // Create notification record in the database
    const values = [userUsername, tech.username, explanation, price, date];
    await Notification.insertNotification(db, values);
    // Send notification (optional)
    // ... (code to send notification to customer and/or technician)

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});
app.post('/check-notifications', isAuthenticated, isUser, isLogged, populateUser, async (req, res) => {
  const username = user.username;
  try {
    
    const notifications = await Notification.getNotifications(db, username);
    console.log(notifications);
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.get('/MyAccountTech', isAuthenticated, isTech, isLogged, populateTech, async (req, res) => {
  res.sendFile(__dirname + '/myaccountTech.html');
});



app.get('/api/MyAccountTech', isAuthenticated, isTech, isLogged, populateTech, async (req, res) => {
  try {
    const TechAccInfo = await Account.getTechAccInfo(db,tech.username);
    res.json({ data: TechAccInfo });
  } catch (err) {
    console.error("Error fetching Technician's Account Info:", err);
    res.status(500).send("Error occurred");
  }
});
app.post('/api/UpdateAccountTech', async (req, res) => {
  const { field, value } = req.body; 

  try {
    const updated = await tech.updateTechColumn(db,field, value);
    res.json({ updated });
  } catch (err) {
    console.error("Error updating Technician's Account Info:", err);
    res.status(500).send("Error occurred");
  }
});


app.post('/api/reviews', isAuthenticated, isUser, isLogged, async (req, res) => {
const { reservationId,reviewText, reviewScore } = req.body;
const userUsername = req.session.userId; 
 
try {
  const reserv = await Reservations.getReservation(db,reservationId);
  Review.addReview(db, reviewText, userUsername, reserv.resTechUsername, reviewScore);
  res.json({ message: 'Review added successfully' });  
} catch (err) {
  console.error('Error:', err);
  res.status(500).send('Server Error');
}
});




app.post('/api/tech_reserv', isAuthenticated, isUser, isLogged, async (req, res) => {
  const { start,end,selectedOption,enteredText } = req.body;
  const tech = await Tech.createTech(db,req.session.techId);
  const specialities = req.session.specialities;
  const services = req.session.services;

  try {
    const message = await Reservations.makeReservation(db, user.username, tech.username,tech.specialty,services, start, end,selectedOption,enteredText);
    res.json({ message });
  } catch (err) {
    console.error("Error making reservation:", err);
    res.status(500).send("Error occurred");
  }
});

app.post('/api/tech_serv/update', isAuthenticated, isUser, isLogged, async (req, res) => {
  const events = req.body;

  try {
    const tech = await Tech.createTech(db,req.session.techId);
    await tech.setAvailability(db, events);
  } catch (err) {
    console.error("Error setting availability:", err);
    res.status(500).send("Error occurred");
  }
});

app.get('/change_reserv/:id', isAuthenticated, isUser, isLogged, async (req, res) => {
  const id = req.params.id;
  req.session.resId = id;
  res.sendFile(__dirname + '/change_reserv.html');
});

app.get('/api/reserv_calendar', isAuthenticated, isUser, isLogged, async (req, res) => {
  const id = req.session.resId;
  try {
    const reserv = await Reservations.getReservation(db,id);
    req.session.techId = reserv.resTechUsername;
    const tech = await Tech.createTech(db,reserv.resTechUsername);
    const availabity =await tech.getAvailability(db);
    res.json({ data: availabity });
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).send("Error occurred");
  }
});

app.get('/api/reserv_info', isAuthenticated, isUser, isLogged, async (req, res) => {
  const id = req.session.resId;
  try {
    const reserv = await Reservations.getReservation(db,id);
    await reserv.deleteReservation(db);
    res.json({reserv});
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).send("Error occurred");
  }
});

app.post('/api/change_reserv', isAuthenticated, isUser, isLogged, async (req, res) => {
  const id = req.session.resId;
  try{
    const reserv = await Reservations.getReservation(db,id);
    const message = await Reservations.makeReservation(db, reserv.resUserUsername, reserv.resTechUsername,reserv.ResSpecialty,reserv.resService, req.body.start, req.body.end,req.body.selectedOption,req.body.enteredText);
    res.json({ message });
  
  } catch (err) {
    console.error("Error changing reservation:", err);
    res.status(500).send("Error occurred");
  }
});

app.post('/user/verify', async (req, res) => {
  const { username, password } = req.body;

  if (user.password === password && user.username === username) {
    res.json({ success: true });
  } else { 
    res.json({ success: false });
  }
});

// ===============================================================================================================


app.listen(8800, () => {
  console.log("Connected to backend.");
});
