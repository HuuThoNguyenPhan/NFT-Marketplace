const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

exports.uploadCloudinary = catchAsyncErrors(async (req, res, next) => {
    const linkFiles = [];
    const newFiles = req.files;
    if (!newFiles || newFiles.length === 0) {
      return next(new ErrorHandler("Rỗng", 404));
    }
  
    for (const file of newFiles) {
      const { path } = file;
      const result = await cloudinary.uploader.upload(path, {
        folder: "user_image",
      });
      linkFiles.push(result.url);
      fs.unlinkSync(path);
    }
    req.newFile = linkFiles;
    next();
  });
  