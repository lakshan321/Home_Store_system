import mongoose from "mongoose";

const supplySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    itemImage: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    itemCode: [{ type: String, required: true }],itemCode: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Supply = mongoose.model("Supply", supplySchema);

export default Supply;
