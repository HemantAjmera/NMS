import User from "../models/User.js";
import StaffSchema from "../models/Staff.js";
import { UnAuthenticatedError } from "../errors/index.js";
import mongoose from "mongoose";

const activeUserMiddleware = async (req, res, next) => {
    try {
        if (req.user.userRole === "Owner") {
            const user = await User.findOne({ _id: req.user.userId });
            if (!user) {
                throw new UnAuthenticatedError("Authentication Invalid");
            }
            if (!user.active) {
                throw new UnAuthenticatedError("Account Blocked!");
            }
            next();
        } else if (req.user.userRole === "Staff") {

            const user_username = req.body.username.slice(0, req.body.username.indexOf('.'));
            const user = await User.findOne({ username: user_username });
            if (!user) {
                throw new BadRequestError("Username is not valid")
            }
            const Staff = mongoose.model("Staff" + user._id.toString(), StaffSchema);
            const staff = await Staff.findOne({ username: req.body.username });
            if (!staff) {
                throw new UnAuthenticatedError("Authentication Invalid");
            }
            if (!staff.active) {
                throw new UnAuthenticatedError("Account Blocked!");
            }
            next();
        } else {
            throw new UnAuthenticatedError("Account not Exist!");
        }
    } catch (error) {
        next(error)
    }
};
export default activeUserMiddleware;