 
 
 
 
 module.exports.signup=(req, res) => {
  console.log("Signup page requested");
  res.render("listings/page.ejs"); 
};
module.exports.signuppost=(async (req, res, next) => {
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
;