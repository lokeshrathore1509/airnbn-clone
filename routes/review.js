// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError");
// const Review = require("../models/review");
// const Listing = require("../models/listing");

// // CREATE REVIEW
// router.post(
//   "/",
//   wrapAsync(async (req, res) => {
//     const { id } = req.params;

//     const listing = await Listing.findById(id);
//     if (!listing) {
//       throw new ExpressError(404, "Listing not found");
//     }

//     const newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     req.flash("success", "New Review created!");
//     res.redirect(`/listings/${id}`);
//   })
// );

// // DELETE REVIEW
// router.delete(
//   "/:reviewId",
//   wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, {
//       $pull: { reviews: reviewId },
//     });
//     await Review.findByIdAndDelete(reviewId);

//     req.flash("success", "Review deleted!");
//     res.redirect(`/listings/${id}`);
//   })
// );

// module.exports = router;








const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Listing = require("../models/listing");

const { isLoggedIn,isReviewAuthor } = require("../middleware");   // ⭐ important
const reviewController  = require("../controllers/reviews.js");

// ==============================
// CREATE REVIEW
// ==============================
router.post(
  "/",
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

// ==============================
// DELETE REVIEW
// ==============================
router.delete(
  "/:reviewId",
  isLoggedIn, isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
