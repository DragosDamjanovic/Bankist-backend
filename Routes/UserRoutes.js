import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import User from "./../Models/UserModel.js";

const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        address: user.address,
        city: user.city,
        balance: user.balance,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password, address, city, balance } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      accountNumber:
        (Math.random() + " ").substring(2, 10) +
        (Math.random() + " ").substring(2, 10),
      address,
      city,
      balance: 1500,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        token: generateToken(user._id),
        address: user.address,
        city: user.city,
        balance: user.balance,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        address: user.address,
        city: user.city,
        balance: user.balance,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      //user.name = req.body.name || user.name;
      //user.email = req.body.email || user.email;
      user.balance = user.balance - req.body.amount;
      //if (req.body.password) {
      //  user.password = req.body.password;
      //}

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        accountNumber: updatedUser.accountNumber,
        address: updatedUser.address,
        balance: updatedUser.balance,
        city: updatedUser.city,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

export default userRouter;
