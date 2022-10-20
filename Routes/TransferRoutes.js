import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../Middleware/AuthMiddleware.js";
import User from "../Models/UserModel.js";
import Transfer from "./../Models/TransferModel.js";
import generateToken from "../utils/generateToken.js";

const transferRouter = express.Router();

// CREATE TRANSFER
transferRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { name, addres, city, amount, accountNumber, purposeOfPayment } =
      req.body;
    const receiver = await User.findOne({ accountNumber });
    const sender = await User.findById(req.user._id);

    if (receiver) {
      receiver.balance = Number(receiver.balance) + Number(amount);
      sender.balance = Number(sender.balance) - Number(amount);

      const transfer = new Transfer({
        name,
        user: req.user._id,
        addres,
        city,
        amount,
        accountNumber,
        purposeOfPayment,
      });

      const updatedReceiver = await receiver.save();
      const updatedSender = await sender.save();
      const createTransfer = await transfer.save();
      res.status(201).json(createTransfer, updatedSender, updatedReceiver);
    } else {
      res.status(400);
      throw new Error("No Transfer items");
    }
  })
);

// USER LOGIN TRANSFERS
transferRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const transfer = await Transfer.find({ user: req.user._id }).sort({
      _id: -1,
    });
    res.json(transfer);
  })
);

// GET TRANSFER BY ID
transferRouter.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const transfer = await Transfer.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (transfer) {
      res.json(transfer);
    } else {
      res.status(404);
      throw new Error("Transfer Not Found");
    }
  })
);

// UPDATE TRANSFERS
transferRouter.put(
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

export default transferRouter;
