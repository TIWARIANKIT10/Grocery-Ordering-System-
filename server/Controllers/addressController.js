import Address from "../models/address.js";

// Add Address : /api/address/add — the owner is always the
// token user; a userId in the body is never trusted.
export const addAddress = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { address } = req.body;
    if (!address || typeof address !== "object") {
      return res.json({ success: false, message: "Invalid address" });
    }
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Addresses : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
