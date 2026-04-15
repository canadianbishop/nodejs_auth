import express from 'express';
import { authMiddleware } from '../middlware/auth_middleware.js';

const homeRoute = express.Router()


homeRoute.get('/welcome',authMiddleware, (req, res)=>{
      const {userId, role , username} = req.userInfo;

     res.json({
      message:'welcome to the homepage',
      user: {
            _id: userId,
            role, 
            username
      }
     })
} )


export default homeRoute;