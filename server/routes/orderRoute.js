import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, placeOrderCOD, getUserOrders, placeOrderStripe } from '../Controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod',authUser, placeOrderCOD)
orderRouter.get('/user',authUser, getUserOrders)
orderRouter.get('/seller',authSeller, getAllOrders)
orderRouter.post('/stripe',authUser, placeOrderStripe)


export default orderRouter; 