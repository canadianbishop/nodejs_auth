import cloudinary from "../config/cloudinary.js";


const uploadToCloudinary = async (filePath)=>{
      try {
      
            const result = await cloudinary.uploader.upload(filePath);
            return{
                  url:result.secure_url,
                  publicId: result.public_id
            }

      } catch (error) {
          console.error('errro while uploading to cloudinary', error);
          throw new Error('error while uploading to cloudinary', error)
      }
}

export default uploadToCloudinary;