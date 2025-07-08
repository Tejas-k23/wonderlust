const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const Joi = require("../schema.js");
const {isLoggedIn}=require("../middleware.js")


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
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// new listing
router.get("/new", isLoggedIn,( (req, res) => {
  res.render("listings/new.ejs");
}));

router.post("/", validateListing,isLoggedIn, async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Added Successfully");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings/new");
  }
});


router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  newListing.owner=req.user._id;
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));


router.put("/:id", isLoggedIn,validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );

  if (!updatedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));


router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;


