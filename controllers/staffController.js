import mongoose from "mongoose";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js"
import DraftBillSchema from "../models/DraftBill.js";
import StaffSchema from "../models/Staff.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
const createDraftBill = async (req, res, next) => {
    console.log("3")
    try {
        if (req.user.userRole !== "Staff") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { customerName, billItemsList, username, customerNumber } = req.body;
        if (!customerName || !billItemsList || !username) {
            throw new BadRequestError("कृपया सभी स्थान भरें")
        }
        const user_username = req.body.username.slice(0, req.body.username.indexOf('.'));
        const user = await User.findOne({ username: user_username });
        if (!user) {
            throw new BadRequestError("Username नाम सही नहीं है बिल बनाने के लिए")
        }
        const staff_username = req.body.username.slice(req.body.username.indexOf('.') + 1);
        const Staff = mongoose.model("Staff" + user._id.toString(), StaffSchema);  
        const staff = await Staff.findOne({ username: username });
        if (!staff) {
            throw new BadRequestError("Username नाम सही नहीं है बिल बनाने के लिए");
        }   
        const draftBill = mongoose.model("DraftBill" + user._id.toString(), DraftBillSchema)
        draftBill.create({staffId: staff._id.toString(), staffName: (staff.name + (staff.lastName !== undefined ? " "+staff.lastName : "")), customerName,customerNumber:(customerNumber !== undefined ? customerNumber: ""), billItemsList})
        res.json({
            msg: "बिल गया"
        });
    } catch (error) {
        next(error)
    }
}

const getDraftBills = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const draftBill = mongoose.model("DraftBill" + req.user.userId, DraftBillSchema)
        let draftBillList = await draftBill.find({}, ' -staffId -__v').sort({ createdAt: -1 }).limit(10);
        if(!draftBillList){
            throw new BadRequestError("खाली है")
        }
        res.json({
            draftBillList
        });
    } catch (error) {
        next(error)
    }
}
const deleteDraftBill = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { draftId } = req.body;
        console.log(req.params)
        if(!draftId){
            throw new BadRequestError("कृपया सभी स्थान भरें")
        }
        const draftBill = mongoose.model("DraftBill" + req.user.userId, DraftBillSchema)
        const draft = draftBill.findOne({ _id: draftId})
        if(!draft){
            throw new BadRequestError(draftId + "नहीं है")
        }
        await draft.remove();
        res.status(StatusCodes.OK).json({ msg: "हटा दिया"})
    } catch (error) {
        next(error)
    }
}
export { createDraftBill, getDraftBills, deleteDraftBill }