import Account from './account.js';
// tech.js
class Tech extends Account {
  constructor(id_tech,username, password, name, surname, address, phone_number, email, date, specialty, experience_years, LaborCost,services) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_tech = id_tech; 
    this.specialty = specialty;
    this.experience_years = experience_years;
    this.LaborCost = LaborCost;
    this.services = services;
    this.rating;

  }
  
    static async createTech(db,username) {
        const sql = "CALL getTechByUsername(?)";
        try {
          const results = await db.query(sql, [username]);
          if (results && results.length > 0) {
            const test = results[0][0];
            return new Tech(test.id_tech, test.username, test.password, test.name, test.surname, test.address, test.phone_number, test.email, test.date, test.specialty, test.experience_years, test.LaborCost,test.services);
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
        const techs = results[0].map(row => new Tech(row.id_tech, row.username, row.password, row.name, row.surname, row.address, row.phone_number, row.email, row.date, row.specialty, row.experience_years,row.LaborCost,row.services));
        for (let tech of techs) {
          await tech.getAvgRating(db);
        }
        return techs;
      } catch (err) {
        console.error("Error fetching techs:", err);
        return null;
      }
    }
  
    static async filterTechs(specialty, service, ratingRange, priceRange, techs) {
      return techs.filter(tech => {
        const isSpecialtyMatch = tech.specialty == specialty;
        const isServiceIncluded = tech.services.includes(service);
        const isWithinRatingRange = tech.rating >= ratingRange[0] && tech.rating <= ratingRange[1];
        const isWithinPriceRange = tech.LaborCost >= priceRange[0] && tech.LaborCost <= priceRange[1];
  
    
        return isSpecialtyMatch && isServiceIncluded && isWithinRatingRange && isWithinPriceRange;
      });
    }

    async getAvailability(db) {
      const sql = "CALL getAvailability(?)";
      try {
        const results = await db.query(sql, [this.username]);
        const events = JSON.parse(results[0][0].availability);
        return events;
      } catch (err) {
        console.error("Error fetching availability:", err);
        return null;
      }
    }
    async setAvailability(db, availability) {
      const sql = "CALL setAvailability(?, ?)";
      try {
        const results = await db.query(sql, [this.username, JSON.stringify(availability)]);
      } catch (err) {
        console.error("Error setting availability:", err);
        return false;
      }
    }

    async getAvgRating(db) {
      const sql = "CALL calculateAverageReview(?)";
      try {
        const results = await db.query(sql, [this.username]);
        this.rating= results[0][0].AverageReview;
      } catch (err) {
        console.error("Error fetching average rating:", err);
        return null;
      }
    }
  }

  
  export default Tech;