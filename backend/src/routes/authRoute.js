import express from "express";
import { CheckUser, Login, Logout, SignUp, updateProfile } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/signup",SignUp);
router.post("/login",Login);
router.post("/logout",Logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,CheckUser);

export default router;