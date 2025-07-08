const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const{ signup, signuppost}=require("../controller/user.js");
router.get("/signup", (signup))


router.post(
  "/register",
  wrapAsync(signuppost))

router.get("/login", (req, res) => {
  res.render("listings/login.ejs"); 
});


router.post(
  "/login",
  saveRedirectUrl, 
  passport.authenticate("local", {

    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
  }
);


router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye! Logged Out");
    res.redirect("/listings");
  });
});



module.exports = router;
