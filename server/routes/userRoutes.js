import express from "express";
import { isAuth, login, logout, register } from "../Controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { rateLimit } from "../middlewares/rateLimit.js";

const userRouter = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

userRouter.post("/register", authLimiter, register);
userRouter.post("/login", authLimiter, login);
userRouter.get("/is-auth", authUser, isAuth);
// POST and NOT behind authUser: a state-changing GET is
// prefetch/CSRF-exposed, and an expired-token user must
// still be able to clear their cookie.
userRouter.post("/logout", logout);

export default userRouter;
