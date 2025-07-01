import jwt from 'jsonwebtoken';


const authUser = async (req, res, next)=>{
    const {token} =  req.cookies;
    if(!token){
        return res.json({sucess:false,message:'NOt Authorized  '});
    }

    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
             req.body = req.body || {};
            req.body.userId = tokenDecode.id ; 
            req.user = { _id: tokenDecode.id };
            next();
        }else{
            return res.json({sucess:false, message:'NOt Authorized'});
        }
        
    } catch (error) {
        res.json({sucess:false,message:error.message+"hellow"});
        
    }

}
export default authUser ; 