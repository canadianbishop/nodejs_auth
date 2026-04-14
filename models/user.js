import mongoose, { Mongoose } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'must enter a username'],
      unique: [true, 'user already exist'],
      maxLength: [50, 'can not be more than 50 character'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'must enter a valid email'],
      trim: true,
      unique: [true, 'user already exist'],
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);


export const User = mongoose.model('User', userSchema);

