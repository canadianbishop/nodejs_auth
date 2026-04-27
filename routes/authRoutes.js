import express from 'express';
import { changePassword, loginUser, registerUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlware/auth_middleware.js';

const authRoutes = express.Router();


// all authentication and authorizaton related routes


authRoutes.post('/register', registerUser);

//login user
authRoutes.post('/login', loginUser);

// change password

authRoutes.post('/change-password',authMiddleware, changePassword)







export default authRoutes;