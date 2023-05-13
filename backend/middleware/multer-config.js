const multer = require("multer");

// object to map file MIME types to file extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Image file storage declared with multer. This uses the destination function to send the file to the images folder
// & the filename function to remove whitespace with underscores & adds a time stamp & an extension with file mime types
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Storage key configured for single image and exported
module.exports = multer({ storage: storage }).single("image");
