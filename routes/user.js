const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const{ signup, signuppost, loginpage, login, logout}=require("../controller/user.js");
router.get("/signup", (signup))

const Listing = require("../models/listing.js");
router.post(
  "/register",
  wrapAsync(signuppost))

router.route("/login")
.get(loginpage) 
.post(
  
  saveRedirectUrl, 
  passport.authenticate("local", {

    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  login
);


router.get("/logout", (logout))



module.exports = router;
