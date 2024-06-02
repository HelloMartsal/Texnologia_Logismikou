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
  
    static async getUserBookingHistory(db, username) {
      const sql = "CALL getUserBookingHistory(?)";
      try {
        const results = await db.query(sql, [username]);
        return results[0];
      } catch (err) {
        console.error("Error fetching booking history:", err);
        return null;
      }
    }

    static async getTechBookingHistory(db, username) {
      const sql = "CALL getTechBookingHistory(?)";
      try {
        const results = await db.query(sql, [username]);
        return results[0];
      } catch (err) {
        console.error("Error fetching booking history:", err);
        return null;
      }
    }
  }
  
  export default Reservations;