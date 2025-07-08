const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Joi = require("../schema.js");

// Middleware for Joi validation
const validateListing = (req, res, next) => {
  let { error } = Joi.listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  next();
};

// Index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New form
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create route
router.post("/", validateListing, async (req, res) => {
  try {
    if (!req.body.listing) throw new Error("Send Valid Data");
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Added Successfully");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings/new");
  }
});

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

// Edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!req.body.listing) {
    req.flash("error", "Send Valid Data");
    return res.redirect("/listings");
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );

  if (!updatedListing) throw new ExpressError(400, "Listing not found");
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;
