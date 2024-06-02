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

  static async login(db, username, passwd) {
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
            const table = [message, userId]
  
            return table;
          }
        }
      } 
      return [message, null]
    } catch (err) {
      console.error('Error during login query:', err);
    }
  }

  static async getTechAccInfo(db, username) {
    const sql = "CALL getTechAccInfo(?)";
    try {
      const results = await db.query(sql, [username]);
      return results[0][0];
    } catch (err) {
      console.error("Error fetching Technician's Account Information:", err);
      return null;
    }
  }
}
  
  export default Account;