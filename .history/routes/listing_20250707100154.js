const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const Joi = require("../schema.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")

const { index, show, edit, editput, deletelist ,newlist,newlistpost} = require("../controller/index.js");


//  all listings
router.route("/")
.get(wrapAsync(index))
// .post(isLoggedIn,validateListing,(newlistpost))
.post((req,res)=>{
    res.send(req.body);
})
;

// new listing
router.get("/new", isLoggedIn,(newlist));
//post

router.route("/:id")
.get( wrapAsync(show))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(editput))
.delete(isLoggedIn, isOwner,wrapAsync(deletelist));



router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(edit));






module.exports = router;


