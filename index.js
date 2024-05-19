import express from "express";
import mysql from "mysql";
import path from 'path';
import { fileURLToPath } from 'url';
import session from "express-session";
import bodyParser from'body-parser';
import Database from "./Classes/database.js";



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
// ==================================================== Classes ==============================================================
class Account {
  constructor(username, password, name, surname, address,phone_number, email, date) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.address = address;
    this.phone_number = phone_number;
    this.email = email;
    this.date = date;
  }

  // Add methods as needed
}


class Offers {
  constructor(Id_offer, Off_type, Off_desc, Off_start_date, Off_end_date, Off_price) {
    this.id_offer = Id_offer;
    this.off_type = Off_type;
    this.off_desc = Off_desc;
    this.off_start_date = Off_start_date;
    this.off_end_date = Off_end_date;
    this.off_price = Off_price;
  }
}


class Notifications {
  constructor(NotificationID, NotificationText, NotificationSender, NotificationReceiver, NotificationDate) {
    this.notificationId = NotificationIDID;
    this.notificationText = NotificationText;
    this.notificationSender = NotificationSender;
    this.notificationReceiver = NotificationReceiver;
    this.notificationDate = NotificationDate;
  }
}






class Payment {
  constructor(PaymentID, PaymentAmount, PaymentUserUsername, PaymentTechUsername, PaymentMethod, PaymentDate, PaymentTime) {
    this.paymentIDaymentID = PaymentID;
    this.paymentAmount = PaymentAmount;
    this.paymentUserUsername = PaymentUserUsername;
    this.paymentTechUsername = PaymentTechUsername;
    this.paymentMethod = PaymentMethod;
    this.paymentDate = PaymentDate;
    this.paymentTime = PaymentTime;
  }

  // Add methods as needed
}




class User extends Account {
  constructor(id_us, username, password, name, surname, address, phone_number, email, date) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_us = id_us; // Additional property specific to User
  }

  async getBookingHistory() {
    const sql = "CALL getBookingHistory(?)";
    const usern = this.username;
    try {
      const results = await db.query(sql, [usern]);
      return results[0];
    } catch (err) {
      console.error("Error fetching booking history:", err);
      return null;
    }
  }
}



class Reservations {
constructor(ResID, ResUserUsername, ResTechUsername, ResSpecialty, ResService, ResStatus, ResDate, ResTime) {
  this.resId = ResID;
  this.resUserUsername = ResUserUsername;
  this.resTechUsername = ResTechUsername;
  this.ResSpecialty = ResSpecialty;
  this.resService = ResService;
  this.resStatus = ResStatus;
  this.resDate = ResDate;
  this.resTime = ResTime;
}
}








class Service {
  constructor(Id_serv, Name, Descr, Specialty_id, Price) {
    this.id_serv = Id_serv;
    this.name = Name;
    this.descr = Descr;
    this.specialty_id = Specialty_id;
    this.price = Price;
  }

  // Add methods as needed
}



class Tech extends Account {
  constructor(id_tech,username, password, name, surname, address, phone_number, email, date, specialty, experience_years) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_tech = id_tech; 
    this.specialty = specialty;
    this.experience_years = experience_years;
  }

}

class Admin extends Account {
  constructor(id_ad,username, password, name, surname, address, phone_number, email, date) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_ad = id_ad; 
  }
}
  // Add methods as needed




class Review {
  constructor(Id_sub, Sub_cost, Sub_name, Sub_plan, Sub_start_date, Sub_end_date, Sub_status, Id_tech) {
    this.id_sub = Id_sub;
    this.sub_cost = Sub_cost;
    this.sub_name = Sub_name;
    this.sub_plan = Sub_plan;
    this.sub_start_date = Sub_start_date;
    this.sub_end_date = Sub_end_date;
    this.sub_status = Sub_status;
    this.id_tech = Id_tech;
  }

  // Add methods as needed
}




class Specialty {
  constructor(Id_spec, Name) {
    this.id_spec = Id_spec;
    this.name = Name;
  }

  // Add methods as needed
}


// ==================================================== Middleware ===========================================================



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


app.get('/user', isAuthenticated, isUser, isLogged, (req, res) => {
  
  res.sendFile(__dirname + '/main_page.html');
});
app.get('/',isAuthenticated,isUser,isLogged,(req,res)=>{
  res.sendFile(__dirname + '/main_page.html');
});

app.get('/tech', isAuthenticated, isTech, isLogged, (req, res) => {
  
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

app.get("/booking", (req, res) => {
  res.sendFile(__dirname + '/booking.html');
});

app.get('/api/booking', isAuthenticated, isUser, isLogged, async (req, res) => {
  try {
    const user = new User();
    user.username = req.session.userId;
    const bookings = await user.getBookingHistory();
    console.log(bookings);
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
