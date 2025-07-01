
import express from  'express';
import { isSellerAuth, sellerlogin, sellerlogout } from '../Controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login',sellerlogin);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);
sellerRouter.get('/logout',sellerlogout);
sellerRouter.get('/test', (req, res) => {
  res.send("Seller route is working");
});



export default sellerRouter;