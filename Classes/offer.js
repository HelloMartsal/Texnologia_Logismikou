// offer.js
class Offer {
    constructor(id_offer, off_type, off_desc, off_start_date, off_end_date, off_price) {
      this.id_offer = id_offer;
      this.off_type = off_type;
      this.off_desc = off_desc;
      this.off_start_date = off_start_date;
      this.off_end_date = off_end_date;
      this.off_price = off_price;
    }
  
    static async getAllOffers(db) {
      const sql = "CALL getAllOffers()";
      try {
        const results = await db.query(sql);
        const offers = results[0].map(row => new Offer(row.id_offer, row.off_type, row.off_desc, row.off_start_date, row.off_end_date, row.off_price));
        return offers;
      } catch (err) {
        console.error("Error fetching offers:", err);
        return null;
      }
    }
  }
  
  export default Offer;