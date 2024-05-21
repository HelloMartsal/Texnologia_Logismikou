// service.js
class Service {
    constructor(id_service, name, description, price, duration, id_spec) {
      this.id_service = id_service;
      this.name = name;
      this.description = description;
      this.price = price;
      this.duration = duration;
      this.id_spec = id_spec;
    }
  
    static async getAllServices(db) {
      const sql = "CALL getAllServices()";
      try {
        const results = await db.query(sql);
        const services = results[0].map(row => new Service(row.id_service, row.name, row.description, row.price, row.duration, row.id_spec));
        return services;
      } catch (err) {
        console.error("Error fetching services:", err);
        return null;
      }
    }
  }
  
  export default Service;