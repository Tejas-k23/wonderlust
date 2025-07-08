const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const Joi = require("../schema.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")

const { index, show, edit, editput, deletelist ,newlist,newlistpost} = require("../controller/index.js");


//  all listings
router.route(("/")
.get(wrapAsync(index))
.post(isLoggedIn,validateListing,(newlistpost))
)

// new listing
router.get("/new", isLoggedIn,(newlist));
//post


router.get("/:id", wrapAsync(show));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(edit))


router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(editput))


router.delete("/:id",isLoggedIn, isOwner,wrapAsync(deletelist))

module.exports = router;


