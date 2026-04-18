import { uploadToCloudinary } from '../helpers/cloudinaryHelpers.js';
import { Image } from '../models/image.js';

export const uploadImageController = async (req, res) => {
  try {
    // check if file is missing

    if (!req.file) {
      return res.status(400).json({
        message: 'file missing, please upload an image',
        success: false,
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // save image along with the uploader id in the database;
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    res
      .status(201)
      .json({
        success: true,
        message: 'image  uploaded successfully',
        image: newlyUploadedImage,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'something went wrong try again',
    });
  }
};
