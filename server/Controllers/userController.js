import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { json } from "express";
import jwt from 'jsonwebtoken';





//regiter user
 export const register = async (req, res)=>{
    try{
 const {name,email,password} = req.body; 
 if(!name || !email || ! password){
    return res.json({success:false,message:"missing Details"})
 }
 const exisitingUser = await User.findOne({email});
 if(exisitingUser){
    return res.json({success:false , message : "User alreaday Exits"})
 }

 const hashedPassword = await bcrypt.hash(password,10);
 const user = await User.create({name, email,password:hashedPassword})
 const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

 res.cookie('token',token,{httpOnly:true,
   secure:true, // prevent javascript to access cookie
   secure:process.env.NODE_ENV ==='production' //use secure cookies in production 
   , sameSite:process.env.NODE_ENV === 'production' ? 'none': 'strict' , // csrf protection
   maxAge: 7*24*60*1000,//cookie expiration time 
 })
 return res.json({success:true , message : {email: user.email ,name:user.name}})
 } 
    
    catch(error){
      console.log(error.message);
      res.json({success:false , message:error.message});

    }

 }

 //login user : /api/user/login

 export const login = async (req,res)=>{
   try{
      const {email, password} = req.body;

      if(!email || !password)
         return res.json ({success:false,message:'email and password are required'});
      const user = await User.findOne({email});
      if(!user){
           return res.json ({success:false,message:' invalid email or password '});

      }
      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch)
         return res.json({success:false , message:'incorrect passsword'});

      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

 res.cookie('token',token,{httpOnly:true,
   secure:true, 
   secure:process.env.NODE_ENV ==='production'
   , sameSite:process.env.NODE_ENV === 'production' ? 'none': 'strict' ,
   maxAge: 7*24*60*1000,
 })
 return res.json({success:true , user : {email: user.email ,name:user.name}})
 } 
   
   catch(error ){
      console.log(error.message);
      res.json({success:false , message:error.message});

   }
 }

 // check auth :/api/users.is-auth 
export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID not provided" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
 //logout user : /api/user/logout 

 export const logout  = async (req,res)=>{
   try{
      res.clearCookie('token',{httpOnly:true,
         secure:process.env.NODE_ENV ==='production',
         sameSite : process.env.NODE_ENV ==='production' ? 'none':'strict',

      });

       return res.json({success:true,messsage:"Logged Out"})

   }
   catch(error){
       console.log(error.message);
      res.json({success:false , message:error.message});

   }
 }

 