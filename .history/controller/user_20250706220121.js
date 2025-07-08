 
 
 
 
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
module.exports.loginpage=(req, res) => {
  res.render("listings/login.ejs"); 
};
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
  }
module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye! Logged Out");
    res.redirect("/listings");
  });
};