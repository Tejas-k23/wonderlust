const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js"); // 👈 Required for validateReview

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    console.log(req.originalUrl);
    req.flash("error", "You must be logged in");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing = (req, res,) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errmsg);

    if (req.method === "POST") {
      return res.redirect("/listings/new");
    } else if (req.method === "PUT") {
      const id = req.params.id || req.body.id;
      return res.redirect(`/listings/${id}/edit`);
    }
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  next();
};
