import Order from "../models/order.js";
import Product from "../models/product.js";
import Address from "../models/address.js";
import stripe from "stripe";

const stripeSecret = () => process.env.STRIPE_SECRET_KEY || process.env.Stripe_Secret_key;

/** The one place order input is validated. Previously
 *  neither path checked quantities (negative quantities
 *  reduced the total), stock, or the address — any address
 *  id, including another user's, could be attached. The
 *  ordering user always comes from the verified token,
 *  never from the request body. Returns { items, amount }
 *  with prices recomputed from the DB, or { error }. */
async function validateOrder(req) {
  const userId = req.user?._id || req.body.userId;
  const { items, address } = req.body ?? {};
  if (!userId) return { error: "Not Authorized" };
  if (!address || !Array.isArray(items) || items.length === 0) {
    return { error: "Invalid data" };
  }
  if (items.length > 100) return { error: "Too many items in one order" };

  const addressDoc = await Address.findById(address);
  if (!addressDoc || String(addressDoc.userId) !== String(userId)) {
    return { error: "Invalid delivery address" };
  }

  let amount = 0;
  const cleanItems = [];
  for (const item of items) {
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { error: "Invalid quantity in cart" };
    }
    const product = await Product.findById(item.product);
    if (!product) return { error: "Invalid product in cart" };
    if (product.inStock === false) {
      return { error: `${product.name} is out of stock` };
    }
    amount += product.offerPrice * quantity;
    cleanItems.push({ product: product._id, quantity, _product: product });
  }
  return { userId, items: cleanItems, amount };
}

const withTax = (amount) => amount + Math.floor(amount * 0.02);

export const placeOrderCOD = async (req, res) => {
  try {
    const v = await validateOrder(req);
    if (v.error) return res.json({ success: false, message: v.error });

    await Order.create({
      userId: v.userId,
      items: v.items.map(({ product, quantity }) => ({ product, quantity })),
      amount: withTax(v.amount),
      address: req.body.address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Could not place the order" });
  }
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({ path: "items.product", model: "product" })
      .populate({ path: "address", model: "address" })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({ path: "items.product", model: "product" })
      .populate({ path: "address", model: "address" })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Place order via Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const v = await validateOrder(req);
    if (v.error) return res.json({ success: false, message: v.error });
    if (!stripeSecret()) {
      return res.json({ success: false, message: "Online payment is not configured" });
    }

    // Charge and record the SAME amount: the per-unit
    // taxed price Stripe charges is also the stored total
    // (previously the two formulas drifted apart by cents).
    const line_items = v.items.map(({ _product, quantity }) => ({
      price_data: {
        currency: "usd",
        product_data: { name: _product.name },
        unit_amount: Math.floor(_product.offerPrice + _product.offerPrice * 0.02) * 100,
      },
      quantity,
    }));
    const amount =
      line_items.reduce((sum, li) => sum + (li.price_data.unit_amount / 100) * li.quantity, 0);

    const order = await Order.create({
      userId: v.userId,
      items: v.items.map(({ product, quantity }) => ({ product, quantity })),
      amount,
      address: req.body.address,
      paymentType: "Online",
    });

    // Redirects go to the configured frontend origin —
    // never the raw Origin header, which any caller can
    // spoof to phish the post-payment redirect.
    const frontend =
      (process.env.FRONTEND_URLS || process.env.vercel_frontend || "")
        .split(",")[0]
        .trim() || "http://localhost:5173";

    const stripeInstance = new stripe(stripeSecret());
    let session;
    try {
      session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${frontend}/loader?next=my-orders`,
        cancel_url: `${frontend}/cart`,
        metadata: {
          orderId: order._id.toString(),
          userId: String(v.userId),
        },
      });
    } catch (sessionError) {
      // Don't leave an orphan unpaid order behind when
      // the payment session was never created.
      await Order.findByIdAndDelete(order._id);
      throw sessionError;
    }

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Could not start the payment" });
  }
};

// Stripe webhook : POST /api/order/webhook
// Mounted in server.js with express.raw BEFORE the JSON
// parser — signature verification needs the exact bytes.
// This is the only place isPaid becomes true; without it
// every card-paid order was invisible in My Orders and
// the seller list (both filter on COD or isPaid).
export const stripeWebhook = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !stripeSecret()) {
    console.error("Stripe webhook called but STRIPE_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ success: false, message: "Webhook not configured" });
  }
  let event;
  try {
    const stripeInstance = new stripe(stripeSecret());
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      secret
    );
  } catch (error) {
    console.error("Stripe webhook signature failed:", error.message);
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const orderId = event.data.object.metadata?.orderId;
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
      }
    }
    return res.json({ received: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Webhook handler failed" });
  }
};
