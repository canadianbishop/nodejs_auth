import multer from "multer";
import path from 'path';

// configure the storage type
const storage = multer.diskStorage({
      destination: (req, file, cb)=>{
        cb(null, '/uploads')
      },

      filename: (req, file,cb)=>{
        cb(null , file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
})


// confiugur the filter

const checkFileFilter = (req,file, cb)=>{
     if(file.mimetype.startsWith("image")){
      cb(null, true)
     }else{
        cb(new Error('not an imgage please upload an image'))
     }
}


export const upload = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // file size limit
  },
});










