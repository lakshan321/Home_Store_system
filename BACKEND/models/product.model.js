import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    itemImage: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    itemCode: [{ type: String, required: true }],itemCode: [{ type: String, required: true }],
    purchaseDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;