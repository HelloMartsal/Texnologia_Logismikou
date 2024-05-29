class Review {
  constructor(ReviewID, ReviewText, ReviewUserUsername, ReviewTechUsername, ReviewDate, ReviewScore) {
    this.reviewID = ReviewID;
    this.reviewText = ReviewText;
    this.reviewUserUsername = ReviewUserUsername;
    this.reviewTechUsername = ReviewTechUsername;
    this.reviewDate = ReviewDate;
    this.reviewscore = ReviewScore;
  }

  static async addReview(db, reviewText, reviewUserUsername, reviewTechUsername, reviewScore) {
    const reviewDate = new Date().toISOString().split('T')[0]; // Σημερινή ημερομηνία
    const sql = 'INSERT INTO review (ReviewText, ReviewUserUsername, ReviewTechUsername, ReviewDate, ReviewScore) VALUES (?, ?, ?, ?, ?)';

    try {
      await db.query(sql, [reviewText, reviewUserUsername, reviewTechUsername, reviewDate, reviewScore]);
    } catch (err) {
      console.error('Error inserting review:', err);
      throw err;
    }
  }

  static async getReviewsAverageByTech(db, techUsername) {
    const sql = "CALL calculateAverageReview(?)";
    try {
      const results = await db.query(sql, [techUsername]);
      return results[0][0];
    } catch (err) {
      console.error("Error fetching reviews average:", err);
      return null;
    }
  }
}

export default Review;
