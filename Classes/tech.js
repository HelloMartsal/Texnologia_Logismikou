import Account from './account.js';
// tech.js
class Tech extends Account {
    constructor(id_tech, username, password, name, surname, address, phone_number, email, date, specialty, experience_years) {
      this.id_tech = id_tech;
      this.username = username;
      this.password = password;
      this.name = name;
      this.surname = surname;
      this.address = address;
      this.phone_number = phone_number;
      this.email = email;
      this.date = date;
      this.specialty = specialty;
      this.experience_years = experience_years;
    }
  
    static async createTech(db,username) {
        const sql = "CALL getTechByUsername(?)";
        try {
          const results = await db.query(sql, [username]);
          if (results && results.length > 0) {
            const test = results[0][0];
            return new Tech(test.id_tech, test.username, test.password, test.name, test.surname, test.address, test.phone_number, test.email, test.date, test.specialty, test.experience_years, test.LaborCost);
          } else {
            console.error("No tech found with this username:", username);
            return null;
          }
        } catch (err) {
          console.error("Error creating tech:", err);
          return null;
        }
      }
  
    static async getAllTechs(db) {
      const sql = "CALL getAllTechs()";
      try {
        const results = await db.query(sql);
        const techs = results[0].map(row => new Tech(row.id_tech, row.username, row.password, row.name, row.surname, row.address, row.phone_number, row.email, row.date, row.specialty, row.experience_years));
        return techs;
      } catch (err) {
        console.error("Error fetching techs:", err);
        return null;
      }
    }
  
    static async filterTechs(db, specialty, service,rating,price) {  
      // Implementation here
    }
  }
  
  export default Tech;