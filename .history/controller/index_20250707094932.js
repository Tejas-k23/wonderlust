const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

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

module.exports.show=async (req, res) => {
  if (!listing) {
  req.flash("error", "Listing not found");
  return res.redirect("/listings");
}

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
};
 module.exports.edit=async (req, res) => {
   const { id } = req.params;
   const listing = await Listing.findById(id);
   if (!listing) {
     req.flash("error", "Listing does not exist");
     return res.redirect("/listings");
   }
   res.render("listings/edit.ejs", { listing });
 };
module.exports.editput=(async (req, res) => {
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
});
module.exports.deletelist=(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
});