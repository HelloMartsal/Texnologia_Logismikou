
import Account from './Account.js';

class Tech extends Account {
  constructor(id_tech,username, password, name, surname, address, phone_number, email, date, specialty, experience_years) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_tech = id_tech; 
    this.specialty = specialty;
    this.experience_years = experience_years;
  }


}

export default Tech;
