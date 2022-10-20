import mongoose from "mongoose";

const transferSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    name: { type: String, required: true },
    address: { type: String, required: false },
    city: { type: String, required: true },

    amount: { type: Number, required: true },
    accountNumber: {
      type: Number,
      required: true,
    },
    purposeOfPayment: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.5,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;
