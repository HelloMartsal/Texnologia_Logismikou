// notification.js
class Notification {
    constructor(notificationId, notificationText, notificationSender, notificationReceiver, notificationDate) {
      this.notificationId = notificationId;
      this.notificationText = notificationText;
      this.notificationSender = notificationSender;
      this.notificationReceiver = notificationReceiver;
      this.notificationDate = notificationDate;
    }
  
    static async getNotificationsByReceiver(db, receiverUsername) {
      const sql = "CALL getNotificationsByReceiver(?)";
      try {
        const results = await db.query(sql, [receiverUsername]);
        const notifications = results[0].map(row => new Notification(row.notificationId, row.notificationText, row.notificationSender, row.notificationReceiver, row.notificationDate));
        return notifications;
      } catch (err) {
        console.error("Error fetching notifications:", err);
        return null;
      }
    }
  }
  
  export default Notification;