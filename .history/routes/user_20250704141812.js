const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  console.log("Signup page requested");
  res.render("listings/page.ejs"); 
});


router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/user/login"); 
    }
  })
);

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
