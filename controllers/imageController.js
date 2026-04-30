import uploadToCloudinary from '../helpers/cloudinaryHelper.js';
import Image from '../models/image.js';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

// upload image
export const uploadImageController = async (req, res) => {
  try {
    //     check if file is present in the request body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'file missing please upload an image',
      });
    }

    // safe to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //  save to db
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    // delet file from local storage

    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: 'image uploaded successfully',
      image: newImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'server error something went wrong',
    });
  }
};

// get all images

export const getAllImagesController = async (req, res) => {
  try {
    const images = await Image.find({});
    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'no image found',
      });
    }

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'server error something went wrong',
    });
  }
};

// delete images

export const deleteImageController = async (req, res) => {
  try {
    const getImageId = req.params.id;
    const userId = req.userInfo.userId;

    // find current image

    const image = await Image.findById(getImageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'image not found',
      });
    }
    // check if image is uploaded by the current user who is trying to delete the image;

    if (image.uploadedBy.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: 'you are not authorized to delete this image',
      });
    }

    // delet image from cloudinary storage
    cloudinary.uploader.destroy(image.publicId);

    // delete image from db

    await Image.findByIdAndDelete(getImageId);

    return res.status(200).json({
      success: true,
      message: 'image deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'server error something went wrong',
    });
  }
};

// pagination

export const fetchImageController = async (req, res) => {
  try {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const skip = parseInt(page -1) * limit;
  const sortBy =  req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
  const totalImages = await Image.countDocuments();
  const totalPages = Math.ceil(totalImages/limit);

  const sortObj = {};
  sortObj[sortBy] = sortOrder;
  
  const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

  if(images.lenght === 0){
    return res.status(404).json({
      success:false,
      message: 'no image found'
    })
  }

  return res.status(200).json({
    success:true,
    totalPages,
    totalImages,
    data: images
  })



  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'server errror something went wrong',
    });
  }
};
