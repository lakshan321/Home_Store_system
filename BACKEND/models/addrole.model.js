import mongoose from "mongoose";

const addRoleSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    supUsername: {
      type: String,
      required: true,
      unique: true,
    },
    supEmail: {
      type: String,
      required: true,
      unique: true,
    },
    supPassword: {
      type: String,
      required: true,
    },
    supMobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["supplier", "inventoryManager"],
    },
    isSupplier: {
      type: Boolean,
      default: false,
    },
    isInventoryManager: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AddRole = mongoose.model("AddRole", addRoleSchema);

export default AddRole;
