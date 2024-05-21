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
  }

  export default User;