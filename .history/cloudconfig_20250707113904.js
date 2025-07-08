const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (process.env.NODE_ENV !== "Production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpeg", "jpg"]
  }
});
module.exports={
  cloudinary,storage
}