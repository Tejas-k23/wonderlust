
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // initData.data=initData.data.map((obj)=>({
  //   ...obj,
  //   owner:"6867555e72704214a2704688"
  // }));
  await Listing.insertMany(initData.data); 
  console.log("🌱 Sample listings inserted!");
};

initDB();

