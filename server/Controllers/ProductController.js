import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import productModel from "../models/product.js";

// Add Product: /api/product/add (seller only — authSeller
// runs BEFORE multer in the route, see productRoute.js)
export const addProduct = async (req, res) => {
  const files = req.files ?? [];
  try {
    if (files.length === 0) {
      return res.json({ success: false, message: "At least one product image is required" });
    }
    let parsed;
    try {
      parsed = JSON.parse(req.body.productData);
    } catch {
      return res.json({ success: false, message: "Invalid product data" });
    }
    // Field allow-list: the parsed payload used to be
    // spread straight into create() — a seller could set
    // any schema field (mass assignment).
    const productData = {
      name: parsed.name,
      description: parsed.description,
      price: parsed.price,
      offerPrice: parsed.offerPrice,
      category: parsed.category,
      inStock: parsed.inStock !== false,
    };
    if (!productData.name || !productData.category || !(productData.price >= 0)) {
      return res.json({ success: false, message: "Name, category and a valid price are required" });
    }

    const imagesUrl = await Promise.all(
      files.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await productModel.create({ ...productData, image: imagesUrl });
    res.json({ success: true, message: "Product added" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  } finally {
    // Multer's disk-storage temp files were never deleted —
    // the disk filled a little with every product added.
    await Promise.allSettled(files.map((f) => fs.unlink(f.path)));
  }
};

// Get all products: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get single product by ID: /api/product/id?id=...
// The id comes from the query string — GET request bodies
// are dropped by browsers and proxies, so reading it from
// req.body made this endpoint unreliable for real callers.
export const productById = async (req, res) => {
  try {
    const id = req.query.id || req.body?.id;
    if (!id) return res.json({ success: false, message: "Product id is required" });
    const product = await productModel.findById(id);
    if (!product) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change product stock status: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await productModel.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
