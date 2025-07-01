import Order  from "../models/order.js";
import Product from "../models/product.js"; // ✅ Import the Product model
import stripe from "stripe";

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate amount
    let amount = 0;
    for (const item of items) {
      const productData = await Product.findById(item.product); // ✅ Use different name
      if (!productData) {
        return res.json({ success: false, message: "Invalid product in cart" });
      }
      amount += productData.offerPrice * item.quantity;
    }

    const tax = Math.floor(amount * 0.02);
    amount += tax;

    // Create Order
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD"
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Fixed this line

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
     .populate({ path: "items.product", model: "product" }) // ✅ explicitly use model name
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
  $or: [{ paymentType: "COD" }, { isPaid: true }]
})
.populate({ path: "items.product", model: "product" }) // use lowercase model name
.populate({ path: "address", model: "address" })       // same here
.sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//place order stip 
export const placeOrderStripe= async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const {origin} = req.headers ;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];


    // Calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product); // ✅ Use different name
      productData.push({
        name:product.name,
        price:product.offerPrice,
        quantity : item.quantity,
      })

      if (!productData) {
        return res.json({ success: false, message: "Invalid product in cart" });
      }
     amount += product.offerPrice * item.quantity;

    }

    const tax = Math.floor(amount * 0.02);
    amount += tax;

    // Create Order
     const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online "
    });

    // Stripe Gateway Initialize 
const stripeInstance = new stripe(process.env.Stripe_Secret_key);
//create line items for stripe 
const line_items = productData.map((items)=>{
  return{
    price_data :{
      currency :"usd",
      product_data : {
        name:items.name,
      },
      unit_amount :Math.floor(items.price+items.price*0.02)*100
    },
     quantity :items.quantity,

  }
})
//create session 
const session = await stripeInstance.checkout.sessions.create({
  line_items, 
  mode:"payment",
  success_url:`${origin}/loader?next=my-orders`,
  cancel_url :`${origin}/cart`,
  metadata:{
    orderId:order._id.toString(),
    userId, 
  }
})

    return res.json({ success: true, url:session.url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};