// specialty.js
class Specialty {
    constructor(id_spec, name) {
      this.id_spec = id_spec;
      this.name = name;
    }
  
    static async getAllSpecialties(db) {
      const sql = "CALL getAllSpecialties()";
      try {
        const results = await db.query(sql);
        const specialties = results[0].map(row => new Specialty(row.id_spec, row.name));
        return specialties;
      } catch (err) {
        console.error("Error fetching specialties:", err);
        return null;
      }
    }
  }
  
  export default Specialty;