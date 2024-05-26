import Account from "./account.js";
class User extends Account {
    constructor(id_us, username, password, name, surname, address, phone_number, email, date) {
      super(username, password, name, surname, address, phone_number, email, date);
      this.id_us = id_us; // Additional property specific to User
    }
    static async createUser(db,username) {
      const sql = "CALL getUserByUsername(?)";
      try {
        const results = await db.query(sql, [username]);
        if (results && results.length > 0) {
          const test = results[0][0];
          return new User(test.id_us, test.username, test.password, test.name, test.surname, test.address, test.phone_number, test.email, test.date);
        } else {
          console.error("No user found with this username:", username);
          return null;
        }
      } catch (err) {
        console.error("Error creating user:", err);
        return null;
      }
    }

    static async signupUser(db, username, passwd, name, surname, address, phone, email, date) {
      const addAccountSql = "CALL addAccount(?,?,?,?,?,?,?,?)";

      try {
        const results = await db.query(addAccountSql, [username, passwd, phone, name, surname, address, email, date]);
    
        const message = results[0][0].message;
    
        if (message === 'Account submitted successfully') {
          return message;
        } else {
          return 'Error occurred during signup';
        }
      } catch (err) {
        console.error('Error during signup query:', err);
      }
    }

    async updateUserColumn(db,field, value) {
      const query = `UPDATE account SET ${field} = ? WHERE username = ?`;

      db.query(query, [value, this.username], (err, results) => {
          if (err) {
              console.error('Error updating user info:', err);
              return;
          }
          //res.send('Load succeded');
      });
      return {field, value};
    }
  }

  export default User;