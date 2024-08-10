import express from "express";
import {registerDoctor,loginDoctor,profileInfo,updateProfile} from "../controllers/doctorController.js";
import { verifyUser } from "../middleware/jwt-verfication.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/profile", verifyUser, profileInfo);
router.post("/updateProfile", verifyUser, updateProfile);

export default router;
