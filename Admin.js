// Admin.js
import Account from './Account.js';

class Admin extends Account {
  constructor(id_adm,username, password, name, surname, address, phone_number, email, date) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_adm = id_adm; // additional property specific to Admin
  }


}

export default Admin;
