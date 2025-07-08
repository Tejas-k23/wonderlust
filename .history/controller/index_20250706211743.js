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

module.exports.show=(async (req, res) => {
  const { id } = req.params;
const listing = await Listing.findById(id)  .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

  
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});
// module.exports.index=
