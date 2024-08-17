import express from "express";
import {registerDoctor,loginDoctor,profileInfo,updateProfile,visitRequest,toggleDoctorActiveStatus} from "../controllers/doctorController.js";
import { verifyUser } from "../middleware/jwt-verfication.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/profile", verifyUser, profileInfo);
router.post("/updateProfile", verifyUser, updateProfile);
router.post("/toggleDoctorActiveStatus", verifyUser, toggleDoctorActiveStatus);
router.post("/visitRequest",verifyUser,visitRequest)

export default router;
