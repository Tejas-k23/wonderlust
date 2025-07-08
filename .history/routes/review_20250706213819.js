const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Joi = require("../schema.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isAuthor,validateReview } = require("../middleware.js");




router.post(
  "/",
  isLoggedIn,
            
  validateReview,
  wrapAsync(async (req, res) => {
    

    const listing = await Listing.findById(req.params.id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  });
    const review = new Review(req.body.review);
    review.author = req.user._id;  
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${listing._id}`);
  })
);



router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor, 
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
