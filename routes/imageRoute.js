import express from 'express';
import { uploadImageController } from '../controllers/imageController.js';
import { authMiddleware } from '../middlware/auth_middleware.js';
import { isAdmin } from '../middlware/adminMiddleware.js';
import { upload } from '../middlware/uploadMIddlware.js';

const imageRoute = express.Router();

// upload image
imageRoute.post(
  '/uploadImage',
  authMiddleware,
  isAdmin,
  upload.single('image'),
  uploadImageController
);

// get image

// imageRoute.get('/images');

export default imageRoute;
