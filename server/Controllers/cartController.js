import User from "../models/User.js";

// Update cart : /api/cart/update
// The cart must be a plain object of productId -> positive
// integer, capped in size — previously any JSON blob was
// written into the user document unchecked. Identity comes
// from the verified token, not the body.
export const updateCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    // Accept the DB field name; the client historically
    // sent the misspelled `cardItems` key, which silently
    // updated nothing — accept it too so old clients heal.
    const raw = req.body.cartItems ?? req.body.cardItems;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return res.json({ success: false, message: "Invalid cart data" });
    }
    const entries = Object.entries(raw);
    if (entries.length > 200) {
      return res.json({ success: false, message: "Cart is too large" });
    }
    const cartItems = {};
    for (const [productId, qty] of entries) {
      const quantity = Number(qty);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) continue;
      cartItems[productId] = quantity;
    }

    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Could not update the cart" });
  }
};
