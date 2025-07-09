const express = require("express");
const app = express();
require("dotenv").config();

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
const db_url=process.env.ATLASDB_URL;
const mongoStore=require('connect-mongo');
const store=mongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret:"mysecretstring"
  },
  touchAfter:14*3600,
});
store.on("error",()=>{
  console.log("ERRoR in mongo session");
})
const ExpressError = require("./utils/ExpressError");
const { clear } = require("console");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


app.engine("ejs", ejsmate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cookieParser("secretcode")); 
app.use(session({
  store: store, 
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
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
  await mongoose.connect(db_url);
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


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});


app.listen(8080, () => {
  console.log(" Server running on http://localhost:8080");
});
