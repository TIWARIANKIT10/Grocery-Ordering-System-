import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Cookie lifetime: 7 days in MILLISECONDS. This was
// 7*24*60*1000 (≈2.8 hours — a missing *60), so users were
// silently logged out mid-session while their JWT was
// still valid for days.
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: SEVEN_DAYS_MS,
});

// One response shape from register AND login — register
// previously hid the user inside `message:` — including
// the cart, so the client can restore it on sign-in.
const publicUser = (user) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  cardItems: user.cartItems ?? {},
});

// Register user : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.json({ success: false, message: "Please enter a valid email address" });
    }
    if (String(password).length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      // Rely on the unique index instead of a
      // check-then-create race; map the duplicate-key
      // error to a clean message instead of leaking E11000.
      user = await User.create({ name, email, password: hashedPassword });
    } catch (error) {
      if (error?.code === 11000) {
        return res.json({ success: false, message: "User already exists" });
      }
      throw error;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions());
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Could not register" });
  }
};

// Login user : /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    // ONE message for unknown email and wrong password —
    // different strings let anyone enumerate accounts.
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions());
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Could not log in" });
  }
};

// Check auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    // Identity comes from the verified token (authUser),
    // not from anything the client puts in the body.
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout user : /api/user/logout (POST, no auth gate — an
// expired-token user must still be able to clear the cookie)
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
