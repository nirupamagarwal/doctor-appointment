import express from "express";
import {
    authenticate,
    addMedicine
} from "../controllers/vendorController.js";
import { verifyUser } from "../middleware/jwt-verfication.js";

const router = express.Router();

router.post("/authenticate", authenticate);
router.post("/addMedicine",verifyUser, addMedicine);


export default router;
