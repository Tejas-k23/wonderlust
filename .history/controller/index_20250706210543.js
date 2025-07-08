const Listing=require("../models/listing");
module.exports.index=(req, res) => {
  res.render("listings/new.ejs");
};