import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connnectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhook } from "./Controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

await connnectDB();
await connectCloudinary();

// CORS allow-list: FRONTEND_URLS (comma-separated) or the
// legacy single vercel_frontend var; localhost dev origins
// are included outside production. The previous config
// built an `allowedOrigins` array and then never used it —
// one raw env var decided everything.
const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.vercel_frontend ||
  ""
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://localhost:5174");
}
console.log("CORS allowed origins:", allowedOrigins.join(", ") || "(none)");

// Stripe webhook FIRST, with the raw body parser —
// signature verification needs the exact bytes, so this
// must be mounted before express.json() consumes the body.
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Middleware Configuration
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser callers (curl, webhooks) send no Origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("API is Working "));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// JSON 404 + error handler — previously unknown routes and
// parser errors fell through to Express's default HTML
// error pages in an API the client expects JSON from.
// eslint-disable-next-line no-unused-vars
app.use((req, res) => res.status(404).json({ success: false, message: "Not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: "Server error" });
});

app.listen(port, () => {
  console.log(` server is running on http://localhost:${port} `);
});
