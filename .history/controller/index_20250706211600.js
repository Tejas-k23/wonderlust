const Listing=require("../models/listing");
module.exports.index=(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

module.exports.newlist=(req, res) => {
  res.render("listings/new.ejs");
};
module.exports.newlistpost= async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added Successfully");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings/new");
  }
};

// module.exports.index=
// module.exports.index=
