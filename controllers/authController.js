import User from "../models/User.js";
import BillSchema from "../models/Bill.js";
import BillTreeSchema from "../models/BillTree.js";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import StaffSchema from "../models/Staff.js";
const register = async (req, res, next) => {
    try {
        const {
            name,
            role,
            lastName,
            username,
            password,
            active,
            nurseryName,
            nurseryAddress,
            nurseryLocation,
            mobileNumbers,
        } = req.body;
        if (
            !name ||
            !role ||
            !username ||
            !password ||
            !active ||
            !nurseryName ||
            !nurseryAddress ||
            !nurseryLocation ||
            !mobileNumbers
        ) {
            throw new BadRequestError("Please provide all values");
        }
        const userAlreadyExists = await User.findOne({ username });
        if (userAlreadyExists) {
            throw new BadRequestError("Username already in use");
        }
        const user = await User.create({
            name,
            username,
            password,
            active,
            role,
            lastName: lastName !== undefined ? lastName : "",
            nurseryName,
            nurseryAddress,
            nurseryLocation,
            mobileNumbers,
        });
        if (user) {
            mongoose.model("Bill" + user._id.toString(), BillSchema);
            mongoose.model("BillTree" + user._id.toString(), BillTreeSchema);
            mongoose.model("Staff" + user._id.toString(), StaffSchema);
        }
        const token = user.createJWT();
        res.json({
            user: {
                name: user.name,
                lastname: user.lastName,
                username: user.username,
                role: user.role
            },
            token,
        });
    } catch (error) {
        next(error);
    }
    //res.json({ name: name, username: username, password: password });
    //res.send("Register User Route");
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new BadRequestError("कृपया सभी स्थान भरें");
        }
        const user = await User.findOne({ username }).select("+password");
        if (!user) {
            throw new UnAuthenticatedError("अमान्य प्रवेश निषेध");
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new UnAuthenticatedError("अमान्य प्रवेश निषेध");
        }
        if (!user.active) {
            throw new UnAuthenticatedError("आपका खाता ब्लॉक है");
        }
        const token = user.createJWT();
        user.password = undefined;
        user.active = undefined;
        res.status(StatusCodes.OK).json({ user, token });
        //res.send("Login Success");
    } catch (error) {
        next(error);
    }

    //
};

const updateUser = async (req, res, next) => {
    try {
        if(req.user.userRole !== "Owner"){
            throw new UnAuthenticatedError("Autentication Invalid")
        }
        console.log("Update User Called");
        const {
            name,
            username,
            lastName,
            active,
            nurseryName,
            nurseryAddress,
            nurseryLocation,
            mobileNumbers,
        } = req.body;
        if (!name || !username || !lastName) {
            throw new BadRequestError("Please provide all values");
        }
        const user = await User.findOne({ _id: req.body.user.userId });
        user.name = name;
        user.username = username;
        user.lastName = lastName;
        user.active = active;
        user.nurseryName = nurseryName;
        user.nurseryAddress = nurseryAddress;
        user.nurseryLocation = nurseryLocation;
        user.mobileNumbers = mobileNumbers;
        await user.save();
        const token = user.createJWT();
        res.status(StatusCodes.OK).json({ user, token });
    } catch (error) {
        next(error);
    }
    //res.send("Update User Route");
};

export { register, login, updateUser };
