module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be login");
        return res.redirect("/user/login")
    }
    next();
};