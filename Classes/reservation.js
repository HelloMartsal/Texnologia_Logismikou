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
  
    static async getBookingHistory(db, username) {
      const sql = "CALL getBookingHistory(?)";
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