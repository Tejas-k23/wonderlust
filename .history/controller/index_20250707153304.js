const Listing=require("../models/listing");
const listings=require("../routes/listing.js");
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newlist=(req, res) => {
  res.render("listings/new.ejs");
};
// module.exports.newlistpost= async (req, res) => {
//   try {
//     const newListing = new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing Added Successfully");
//     res.redirect("/listings");
//   } catch (err) {
//     req.flash("error", err.message);
//     res.redirect("/listings/new");
//   }
// };
module.exports.newlistpost = async (req, res) => {
  try {
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // fixed case
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "New listing created");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};


module.exports.show = async (req, res) => {
  const { id } = req.params;
  
  const listing = await Listing.findById(id)
    .populate({
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

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  let ogImageUrl = listing.image.url;
  ogImageUrl = ogImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, ogImageUrl });
};

module.exports.editput = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.deletelist=(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
});