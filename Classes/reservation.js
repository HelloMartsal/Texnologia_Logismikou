
class Reservations {
    constructor(ResID, ResUserUsername, ResTechUsername, ResSpecialty, ResService, ResStatus, ResStartDate, ResEndDate,com_meth,com_text) {
      this.resId = ResID;
      this.resUserUsername = ResUserUsername;
      this.resTechUsername = ResTechUsername;
      this.ResSpecialty = ResSpecialty;
      this.resService = ResService;
      this.resStatus = ResStatus;
      this.resStartDate = ResStartDate;
      this.resEndDate = ResEndDate;
      this.com_meth = com_meth;
      this.com_text = com_text;

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

    static async getReservation(db, ResId) {
      const sql = "Select * from reservation where ResID = ?";
      try {
        const results = await db.query(sql, [ResId]);
        const reservation = new Reservations(results[0].ResID, results[0].ResUserUsername, results[0].ResTechUsername, results[0].ResSpecialty, results[0].ResService, results[0].ResStatus, results[0].ResStartDate, results[0].ResEndDate,results[0].com_meth,results[0].com_text);
        return reservation;
      } catch (err) {
        console.error("Error fetching reservation:", err);
        return null;
      }
    }
    async deleteReservation(db) {
      const sql = "Delete from reservation where ResID = ?";
      try {
        await db.query(sql, [this.resId]);
        return true;
      } catch (err) {
        console.error("Error deleting reservation:", err);
        return false;
      }
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

