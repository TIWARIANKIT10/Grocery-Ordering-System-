import express from "express";
import { isSellerAuth, sellerlogin, sellerlogout } from "../Controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";
import { rateLimit } from "../middlewares/rateLimit.js";

const sellerRouter = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

sellerRouter.post("/login", authLimiter, sellerlogin);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
sellerRouter.post("/logout", sellerlogout);
sellerRouter.get("/test", (req, res) => {
  res.send("Seller route is working");
});

export default sellerRouter;
