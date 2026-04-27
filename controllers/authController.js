import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

    const { password: _, ...safeUser } = newUser.toObject();

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
    const { username, password } = req.body;

    //    check if user exists

    const userExists = await User.findOne({ username });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'user doesn"t exist',
      });
    }

    // check if password match;

    const isPasswordMatch = await bcrypt.compare(password, userExists.password);
    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: 'invalid credentials',
      });
    }

    // create a bearer token

    const accessToken = jwt.sign(
      {
        userId: userExists._id,
        username: userExists.username,
        role: userExists.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '30m',
      }
    );

    // return a response
    res.status(200).json({
      success: true,
      message: 'login successful',
      accessToken,
    });
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

// change password

export const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // extract old and new password
    const { oldPassword, newPassword } = req.body;

    // find the current loggedin user through the id

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'no user found',
      });
    }

    // check if the old password is correct;

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'invalid old password please try again!',
      });
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //  update user password

    user.password = newHashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'password changed successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'server error something went wrong',
    });
  }
};
