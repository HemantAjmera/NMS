import express from "express";

const router = express.Router();

import {
    register,
    login,
    getStaffList,
    updateStaffList,
    deleteStaff,
} from "../controllers/staffAuthController.js";

import authenticateUser from "../middleware/auth.js";
import activeUserMiddleware from "../middleware/active-user.js";

router.route("/").get([authenticateUser,activeUserMiddleware], getStaffList)
router.route("/register").post([authenticateUser, activeUserMiddleware], register);
router.route("/login").post(login);
router.route("/update").patch([authenticateUser,activeUserMiddleware],updateStaffList);
router.route('/delete').post([authenticateUser, activeUserMiddleware], deleteStaff)

export default router;
