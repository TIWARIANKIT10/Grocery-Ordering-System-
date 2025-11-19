import mongoose from "mongoose";
const connnectDB = async()=>{
    try{
        mongoose.connection.on('connected',()=> console.log("Database Connected"));
        await mongoose.connect(process.env.MONDODB_URL)
    }
    catch(error){
        console.error(error.message);
    }
}

export default connnectDB ;  