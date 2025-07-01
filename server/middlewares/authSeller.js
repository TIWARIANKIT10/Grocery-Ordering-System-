import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  const { sellertoken } = req.cookies;

  if (!sellertoken) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(sellertoken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authSeller;
