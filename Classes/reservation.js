class Reservations {
    constructor(ResID, ResUserUsername, ResTechUsername, ResSpecialty, ResService, ResStatus, ResStartDate, ResEndDate) {
      this.resId = ResID;
      this.resUserUsername = ResUserUsername;
      this.resTechUsername = ResTechUsername;
      this.ResSpecialty = ResSpecialty;
      this.resService = ResService;
      this.resStatus = ResStatus;
      this.resStartDate = ResStartDate;
      this.resEndDate = ResEndDate;
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

    static async makeReservation(db, username, techUsername, specialty, service, startDate, endDate,selectedOption,inputText) {
      const sql = "CALL createReservation(?,?,?,?,?,?,?,?)";
      try {
        const results = await db.query(sql, [username, techUsername, specialty, service, startDate, endDate,selectedOption,inputText]);
        return results
      } catch (err) {
        console.error("Error making reservation:", err);
        return null;
      }
    }
  }
  
  export default Reservations;