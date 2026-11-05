import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body = req.body || {};
      req.body.userId = tokenDecode.id;
      req.user = { _id: tokenDecode.id };
      next();
    } else {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    // Never leak the raw JWT error to clients.
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};
export default authUser;
