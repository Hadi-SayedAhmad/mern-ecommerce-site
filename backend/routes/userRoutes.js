import express from "express";
import {protect, admin} from "../middleware/authMiddleware.js" 
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, deleteUser, updateUser, getUserById } from "../controllers/userController.js";
const router = express.Router();



router.route("/")
    .get(protect, admin, getUsers)
    .post(registerUser)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/:id")
    .get(protect, admin,getUserById)
    .delete(protect, admin,deleteUser)
    .put(protect, admin,updateUser)
router.post("/logout", logoutUser);
router.post("/auth", authUser);



export default router;