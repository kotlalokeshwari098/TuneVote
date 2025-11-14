require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Missing Cloudinary configuration. Please check your .env file.");
}

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
      access_mode: "public"
    });
    // console.log(response)

    // console.log("File uploaded:", response.secure_url);
    fs.unlinkSync(localFilePath); // delete local file
    return response;
  } catch (err) {
    // console.log("Cloudinary upload error:", err);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};


module.exports = {
  uploadOnCloudinary
};