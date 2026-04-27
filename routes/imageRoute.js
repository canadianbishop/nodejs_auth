import express from 'express';
import { authMiddleware } from '../middlware/auth_middleware.js';
import { isAdmin } from '../middlware/adminMiddleware.js';
import { upload } from '../middlware/uploadMiddleware.js';
import { getAllImagesController, uploadImageController } from '../controllers/imageController.js';

const imageRoute = express.Router();

// upload image
imageRoute.post('/uploadImage',authMiddleware,isAdmin,upload.single('image'),uploadImageController)

// get all images

imageRoute.get('/getImages', authMiddleware, getAllImagesController);


export default imageRoute;