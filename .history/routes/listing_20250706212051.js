const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const Joi = require("../schema.js");
const {isLoggedIn, isOwner}=require("../middleware.js")

const { index, show, edit, editput } = require("../controller/index.js");
const validateListing = (req, res, next) => {
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

//  all listings
router.get("/", wrapAsync(index));

// new listing
router.get("/new", isLoggedIn,(newlist));
//post

router.post("/", isLoggedIn,validateListing,(newlistpost))

router.get("/:id", wrapAsync(show));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(edit))


router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(editput))


router.delete("/:id",isLoggedIn, isOwner,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;


