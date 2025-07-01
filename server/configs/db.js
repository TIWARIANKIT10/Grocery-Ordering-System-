import mongoose from "mongoose";
const connnectDB = async()=>{
    try{
        mongoose.connection.on('connected',()=> console.log("Database Connected"));
        await mongoose.connect(`mongodb+srv://bcsitexample:DBispKXcF5LcZvgF@cluster0.idzn2hw.mongodb.net/greencart`)
    }
    catch(error){
        console.error(error.message);
    }
}

export default connnectDB ;  