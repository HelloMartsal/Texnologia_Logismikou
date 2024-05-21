import Account from './account.js';

class Admin extends Account {
  constructor(id_ad, username, password, name, surname, address, phone_number, email, date) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_ad = id_ad; 
  }

}

export default Admin;