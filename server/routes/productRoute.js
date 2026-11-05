import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import { addProduct, changeStock, productById, productList } from "../Controllers/ProductController.js";
const productRouter = express.Router();

// authSeller BEFORE multer: multer writes uploaded files
// to disk as it runs, so the old order let unauthenticated
// callers write arbitrary files before the seller check.
productRouter.post("/add", authSeller, upload.array("images", 5), addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productById);

productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
