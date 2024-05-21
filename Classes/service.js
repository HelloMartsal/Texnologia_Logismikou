class Service {
  constructor(Id_serv, Name, Descr, Specialty_id, ) {
    this.id_serv = Id_serv;
    this.name = Name;
    this.descr = Descr;
    this.specialty_id = Specialty_id;
  }
  static async getAllServices(db) {
    const sql = "CALL getAllServices()";
    try {
      const results = await db.query(sql);
      const services = results[0].map(row => new Service(row.id_serv, row.name, row.descr, row.specialty_id));
      return services;
    } catch (err) {
      console.error("Error fetching services:", err);
      return null;
    }
  }
  
}

  
  export default Service;