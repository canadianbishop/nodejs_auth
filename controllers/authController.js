import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

// register controller
export const registerUser = async (req, res) => {
  try {
    // extract user info from reques body
    const { username, email, password, role } = req.body;
    //      check if user already exist in db
    const userExist = await User.findOne({ $or: [{ username }, { email }] });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'user already exist with same username or email',
      });
    }

    // hash user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user and save

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

//     return only user without the password field

  const {password:_, ...safeUser}= newUser.toObject();
    
   return res.status(201).json({
      success: true,
      message: 'user created successfully',
      data: safeUser,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'duplicate entry detected',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'server error something went wrong',
    });
    console.log(error);
  }
};

// login controller

export const loginUser = async (req, res) => {
  try {
   const {username, password} = req.body;
   
//    check if user exists

const userExists = await User.findOne({username});

if(!userExists){
      return res.status(404).json({
            success:false,
            message:'invalid credentials'
      })
}

// check if password match;

const isPasswordMatch = await bcrypt.compare(password, userExists.password);
if(!isPasswordMatch){
       return res.status(404).json({
            success:false,
            message:'invalid credentials'
      })
}

// create a bearer token



  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'server error something went wrong',
    });
    console.log(error);
  }
};
