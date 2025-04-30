import express from "express";
import { addRole, getRoals, deleteSuplier} from "../controllers/addrole.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addRole);
router.get("/getRoles",verifyToken, getRoals);
router.delete('/delete/:userId', verifyToken, deleteSuplier);

export default router;
