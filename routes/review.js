const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Joi = require("../schema.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isAuthor,validateReview } = require("../middleware.js");

const{newReview, delReview}=require("../controller/review.js");


router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(newReview))

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor, 
 (delReview))

module.exports = router;
