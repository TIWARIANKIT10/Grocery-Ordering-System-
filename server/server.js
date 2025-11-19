import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors' ;
import connnectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js'
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

await connnectDB()
await connectCloudinary()


// Allow multiple Origins
const allowedOrigins = [process.env.vercel_frontend]

//Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.vercel_frontend, credentials:true}));


app.get('/',(req,res)=>res.send("API is Working "));
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port,()=>{
    console.log(` server is running on http://localhost:${port} `)
})