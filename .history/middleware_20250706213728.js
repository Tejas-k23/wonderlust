const Listing = require("./models/listing.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        console.log(req.originalUrl);
        req.flash("error","You must be login");
        return res.redirect("/user/login")
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}
const Review = require("./models/review");

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
module.exports.validateListing = (req, res, next) => {
  const { error } = Joi.listingSchema.validate(req.body);
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
  let { error } = Joi.reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  next();
};