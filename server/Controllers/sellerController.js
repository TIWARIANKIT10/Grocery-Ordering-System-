import jwt from 'jsonwebtoken'; // ✅ Correct import
import dotenv from 'dotenv';

dotenv.config(); // ✅ Needed if not already called globally

// ✅ Seller Login: /api/seller/login
export const sellerlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check hardcoded seller credentials from .env
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      // ✅ Correct jwt.sign usage
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('sellertoken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Seller login error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Seller Auth Check: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.error('Auth check error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Seller Logout: /api/seller/logout
export const sellerlogout = async (req, res) => {
  try {
    res.clearCookie('sellertoken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
