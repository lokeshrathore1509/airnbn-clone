const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews.js");

// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    wrapAsync(reviewController.createReview)
);

// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
