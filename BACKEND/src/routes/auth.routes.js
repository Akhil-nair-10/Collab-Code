import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyUser from "../middlewares/auth.middlware.js"

const router = express.Router();

router.post("/register", authController.registerMe)
router.post("/login", authController.loginMe)
router.get("/me", verifyUser, authController.findMeLite)
router.get("/fetchMe", verifyUser, authController.findMe)
router.get("/check", verifyUser, authController.checkAuth);
router.post("/logout", authController.logoutMe)
router.post("/delete", verifyUser, authController.deleteMe)
router.put("/changePWD", verifyUser, authController.changePassword)
router.put("/changeAvt", verifyUser, authController.changeAvatar);

export default router;