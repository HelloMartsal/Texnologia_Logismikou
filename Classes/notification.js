// notification.js
class Notification {
    constructor(notificationId, notificationText, notificationSender, notificationReceiver, notificationDate) {
      this.notificationId = notificationId;
      this.notificationText = notificationText;
      this.notificationSender = notificationSender;
      this.notificationReceiver = notificationReceiver;
      this.notificationDate = notificationDate;
    }
  
    static async insertNotification(db, values) {
      const sql = 'INSERT INTO NotificBill (userUsername, techUsername, explanation, price, date) VALUES (?, ?, ?, ?, ?)';
      try {
        await db.query(sql, values);
        return true;
      } catch (err) {
        console.error('Error inserting notification:', err);
        return false;
      }
    }

    static async getNotifications(db, username) {
      const sql = 'SELECT * FROM NotificBill WHERE userUsername = ?';
      try {
        const results = await db.query(sql, [username]);
        const notifications = results.map(row => new Notification(row.notificationId, row.notificationText, row.notificationSender, row.notificationReceiver, row.notificationDate));
        return notifications;
      } catch (err) {
        console.error('Error fetching notifications:', err);
        return null;
      }
    }
  }
  
  export default Notification;