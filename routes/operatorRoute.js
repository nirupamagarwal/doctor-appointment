import express from "express";

import { verifyUser } from "../middleware/jwt-verfication.js";
import { loginOperator, profileInfo,responseToBookingRequest, registerOperator, updateProfile } from "../controllers/operatorController.js";

const router = express.Router();

router.post("/register", registerOperator);
router.post("/login", loginOperator);
router.get("/profile", verifyUser, profileInfo);
router.post("/updateProfile", verifyUser, updateProfile);
router.post("/responseToBookingRequest",verifyUser,responseToBookingRequest)


export default router;
