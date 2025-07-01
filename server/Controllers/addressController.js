import Address from "../models/address.js"
// add Address : api/address/add

export const  addAddress =  async (req,res)=>{
    try {
        const {address, userId} = req.body
        await Address.create({...address, userId})

res.json({success:true, message:"address added sucessFully "})   
 } catch (error) {

     console.log(error.message);
      res.json({success:false , message:error.message});
        
    }
}

export const  getAddress =  async (req,res)=>{
    try {

        const {userId} = req.body
        const addresses = await Address.find({userId})
        res.json({success:true, addresses})


        
    } catch (error) {
         console.log(error.message);
      res.json({success:false , message:error.message});
        
        
    }

}