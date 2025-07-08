const Review = require("../models/review.js");
module.exports.newReview=(async (req, res) => {
    

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
  }
);

