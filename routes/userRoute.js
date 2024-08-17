import express from "express";
import authenticateUser, {

  getProfileInfo,
  updateUserInfo,
  orderMedicine,
  bookDocter,
  medicalHistory
} from "../controllers/userController.js";
import { verifyUser } from "../middleware/jwt-verfication.js";

const router = express.Router();

router.post("/authenticate", authenticateUser);
router.post("/profile", verifyUser, getProfileInfo);
router.post("/update", verifyUser, updateUserInfo);
router.post("/orderMedicine", verifyUser, orderMedicine);
router.post("/bookDocter", verifyUser, bookDocter);
router.post("/medicalHistory",verifyUser,medicalHistory);


export default router;
