import mongoose from "mongoose";
import 'dotenv/config';

const Connect_Db = async ()=>{
      try {
            await mongoose.connect(process.env.DB_URL);
            console.log('connected to database successfully')
            
      } catch (error) {
         console.log(error);
         process.exit(1);   
      }
}

export default Connect_Db;