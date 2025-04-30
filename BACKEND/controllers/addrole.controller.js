import bcrypt from "bcryptjs";
import AddRole from "../models/addrole.model.js";

export const addRole = async (req, res, next) => {
  try {
    const { supplierName, supUsername, supEmail, supPassword, supMobile, role } = req.body;

    const existingSupplier = await AddRole.findOne({ supUsername });
    if (existingSupplier) {
      return res.status(400).json({ message: "Supplier already exists!" });
    }

    const hashedPassword = await bcrypt.hash(supPassword, 10);

    const newAddRole = new AddRole({
      supplierName,
      supUsername,
      supEmail,
      supPassword: hashedPassword,
      supMobile,
      role,
      isSupplier: role === "supplier",
      isInventoryManager: role === "inventoryManager",
    });

    const savedSupplier = await newAddRole.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    next(error);
  }
};

export const getRoals = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all Roals'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const AddRoles = await AddRole.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = AddRoles.map((role) => {
      const { password, ...rest } = role._doc;
      return rest;
    });

    const totaRoles = await AddRole.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await AddRole.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      AddRoles: usersWithoutPassword,
      totaRoles,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSuplier = async (req, res, next) => {
  if (!req.user.isAdmin && req.role.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await AddRole.findByIdAndDelete(req.params.userId);
    res.status(200).json("Suplier deleted successfully");
  } catch (error) {
    next(error);
  }
};