
import Account from './Account.js';

class User extends Account {
  constructor(id_us,username, password, name, surname, address, phone_number, email, date) {
    super(username, password, name, surname, address, phone_number, email, date);
    this.id_us = id_us; // additional property specific to Admin
  }

 
}

export default User;
