import express from 'express';
import { authMiddleware } from '../middlware/auth_middleware.js';
import { isAdmin } from '../middlware/adminMiddleware.js';

const adminRoutes = express.Router();


adminRoutes.get('/dashboard',authMiddleware, isAdmin, (req,res)=>{
      res.status(200).json({
            message: 'welcome to the admin route'
      })
})

export default adminRoutes;