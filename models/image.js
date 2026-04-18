import mongoose from "mongoose";

const imageSChema = new mongoose.Schema({
      url:{
            type:String,
            required:true
      },

      publicId:{
            type:String,
            
      },

      uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
      }
}, {timestamps:true})

export const Image= mongoose.model("Image", imageSChema);