const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const listings=require("./routes/listing.js");
const reviewRoutes = require("./routes/review");
const flash         = require("connect-flash");
const cookieParser  = require("cookie-parser");
const session       = require("express-session");
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Joi = require("./schema.js");
const User = require("./models/user.js");        
const userRoutes = require("./routes/user.js");
const Listing = require("./models/listing.js");

const ExpressError = require("./utils/ExpressError");
const { clear } = require("console");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const db_url=ATLASDB_URL;

app.engine("ejs", ejsmate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cookieParser("secretcode")); // for signed cookies
app.use(session({
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());         
passport.deserializeUser(User.deserializeUser());     
app.get('/favicon.ico', (req, res) => res.status(204));


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use("/listings",listings);
app.use("/user", userRoutes);  
app.use("/listings/:id/reviews", reviewRoutes);

app.use((req, res, next) => {
  const err = new ExpressError(404, "Page Not Found");
  next(err);
});

// app.use((err, req, res, next) => {
//   const { statuscode = 500, message = "Something went wrong" } = err;
//   res.status(statuscode).render("listings/error.ejs", { message });
// });
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});

// Start Server
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
