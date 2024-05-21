// review.js
class Review {
    constructor(ReviewID, ReviewText, ReviewUserUsername, ReviewTechUsername, ReviewDate, ReviewScore) {
      this.reviewID = ReviewID;
      this.reviewText = ReviewText;
      this.reviewUserUsername = ReviewUserUsername;
      this.reviewTechUsername = ReviewTechUsername;
      this.reviewDate = ReviewDate;
      this.reviewscore = ReviewScore;
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