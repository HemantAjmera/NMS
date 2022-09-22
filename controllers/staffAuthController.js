import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import StaffSchema from "../models/Staff.js";
import mongoose from "mongoose";
import validator from "validator";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
const register = async (req, res, next) => {
    try {
        if(req.user.userRole !== "Owner"){
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { role, name, username, password, lastName, active } = req.body;
        console.log(username, password, name, active)
        if (!username || !password || !name) {
            throw new BadRequestError("कृपया सभी स्थान भरें");
        }
        if (!validator.matches(("." + username), "^\\.[a-zA-Z0-9_]+$")) {
            throw new BadRequestError("Username नाम सही नहीं है");
        }

        const Staff = mongoose.model("Staff" + req.user.userId, StaffSchema);
        const staffList =  await Staff.find({});
        if(staffList.length > 2){
            throw new BadRequestError("और नहीं बना सकता!");
        }

        const user = await User.findOne({ _id: req.user.userId });
        const staffusername = user.username + "." + username
        const staffAlreadyExists = await Staff.findOne({ username: staffusername });

        if (staffAlreadyExists) {
            throw new BadRequestError("Username पहले से ही उपयोग में है");
        }
        const staff = await Staff.create({
            ownerId: req.user.userId,
            name,
            username: staffusername,
            password,
            lastName: lastName !== undefined ? lastName : "",
            active: active !== undefined ? active : false,
            role: role !== undefined ? role : "Staff",
            nurseryName: user.nurseryName !== undefined ? user.nurseryName : "" 
        });
        res.json({
            staff: {
                name: staff.name,
                lastname: staff.lastName,
                username: staff.username,
                nurseryName: staff.nurseryName
            },
        });
    } catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new BadRequestError("कृपया सभी स्थान भरें");
        }
        if (!validator.matches(username, "^[a-zA-Z0-9_]+[.]+[a-zA-Z0-9_]*$")) {
            throw new BadRequestError("Username नाम सही नहीं है")
        }
        const user_username = username.slice(0, username.indexOf('.'));
        const user = await User.findOne({ username: user_username });
        if (!user) {
            throw new BadRequestError("Username नाम सही नहीं है")
        }
        const Staff = mongoose.model("Staff" + user._id.toString(), StaffSchema);
        const staff = await Staff.findOne({ "username": username })
        if (!staff) {
            throw new BadRequestError("Username नाम सही नहीं है")
        }
        const isPasswordCorrect = await staff.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य");
        }
        if (!staff.active) {
            throw new UnAuthenticatedError("आपका खाता ब्लॉक है");
        }
        const token = staff.createJWT();
        staff.password = undefined;
        staff.active = undefined;
        res.status(StatusCodes.OK).json({ user:{role:staff.role, name:staff.name, username:staff.username ,nurseryName:staff.nurseryName }, token });
        // const staff = await;
    } catch (error) {
        next(error)
    }
};

const updateStaff = (req, res, next) => {
    if(req.user.userRole !== "Owner"){
        throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
    }
};

const getStaffList = async (req, res, next) => {
    try {
        if(req.user.userRole !== "Owner"){
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const Staff = mongoose.model("Staff" + req.user.userId, StaffSchema);
        const staffList = await Staff.find({});
        res.status(StatusCodes.OK).json({
            staffList,
        });
    } catch (error) {
        next(error);
    }
}

const updateStaffList = async (req, res, next) => {
    try {
        if(req.user.userRole !== "Owner"){
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { staffList } = req.body;
        if(!staffList){
            throw new BadRequestError("कृपया सभी स्थान भरें")
        }
        if(staffList.length === 0){
            throw new BadRequestError("स्टाफ की सूची खाली है")
        }
        const filteredTrueStaffList = staffList.filter(staff => staff.active).map((staff => ({ "_id": staff._id, "active": staff.active })))
        const filteredFalseStaffList = staffList.filter(staff => !staff.active).map((staff => ({ "_id": staff._id, "active": staff.active })))
        const Staff = mongoose.model("Staff" + req.user.userId, StaffSchema);
        await Staff.updateMany({ _id: { $in: filteredTrueStaffList.map((staff) => staff._id) } }, { $set: { active: true } })
        await Staff.updateMany({ _id: { $in: filteredFalseStaffList.map((staff) => staff._id) } }, { $set: { active: false } })
        
        res.status(StatusCodes.OK).json({ msg: "List Update Success"})

    } catch (error) {
        next(error)
    }
}
const deleteStaff = async  (req, res, next) => {
    try {
        if(req.user.userRole !== "Owner"){
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { staffId } = req.body;
        console.log(req.params)
        if(!staffId){
            throw new BadRequestError("कृपया सभी स्थान भरें")
        }
        const Staff = mongoose.model("Staff" + req.user.userId, StaffSchema);
        const staff = Staff.findOne({ _id: staffId})
        if(!staff){
            throw new BadRequestError(staffId + "वाला कोई कर्मचारी नहीं")
        }
        await staff.remove();
        res.status(StatusCodes.OK).json({ msg: "स्टाफ हटा दिया गया"})

    } catch (error) {
        next(error)
    }
}
export { register, login, updateStaff, getStaffList, updateStaffList, deleteStaff };
