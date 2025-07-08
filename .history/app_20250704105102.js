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
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const user = require("./models/user.js");

const ExpressError = require("./utils/ExpressError");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
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

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings",listings);
app.use("/user",user);
app.use("/listings/:id/reviews", reviewRoutes);

app.use((req, res, next) => {
  const err = new ExpressError(404, "Page Not Found");
  next(err);
});

// app.use((err, req, res, next) => {
//   const { statuscode = 500, message = "Something went wrong" } = err;
//   res.status(statuscode).render("listings/error.ejs", { message });
// });

// Start Server
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
