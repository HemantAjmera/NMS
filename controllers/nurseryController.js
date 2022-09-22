import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import BadRequestError from "../errors/bad-request.js";
import BillSchema from "../models/Bill.js";
import BillTreeSchema from "../models/BillTree.js";
import TreeNameSchema from "../models/TreeName.js";
import User from "../models/User.js";
import { UnAuthenticatedError } from '../errors/index.js'
const createBill = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const {
            customerName,
            customerNumber,
            price,
            loadingCharge,
            discount,
            totalPrice,
            paymentMethod,
            payInCash,
            payInOnline,
            totalPaid,
            dueAmount,
            treeList,
        } = req.body;
        if (

            customerName == undefined ||
            price == undefined ||
            loadingCharge == undefined ||
            discount == undefined ||
            totalPrice == undefined ||
            paymentMethod == undefined ||
            payInCash == undefined ||
            payInOnline == undefined ||
            totalPaid == undefined ||
            dueAmount == undefined ||
            treeList == undefined
        ) {
            throw new BadRequestError("कृपया सभी स्थान भरें");
        }
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const BillTree = mongoose.model(
            "BillTree" + req.user.userId,
            BillTreeSchema
        );
        let lastBillNo = 101;
        let lastBillObj = await Bill.find().sort({ billNo: -1 }).limit(1);
        lastBillNo =
            lastBillObj.length !== 0
                ? parseInt(lastBillObj[0].billNo) + 1
                : 101;
        const billTree = await BillTree.create({ treeList });
        const bill = await Bill.create({
            billNo: lastBillNo,
            customerName: customerName,
            customerNumber: customerNumber !== undefined ? customerNumber : "",
            price: price,
            loadingCharge: loadingCharge,
            discount: discount,
            totalPrice: ((price + loadingCharge) - discount),
            paymentMethod: paymentMethod,
            payInCash: payInCash,
            payInOnline: payInOnline,
            totalPaid: totalPaid,
            dueAmount: dueAmount,
            treeListId: billTree._id.toString(),
            createdBy: req.user.userId,
        });
        bill.createdBy = undefined;
        bill.__v = undefined
        res.status(StatusCodes.CREATED).json({ bill });
    } catch (error) {
        next(error);
    }
};

const updateBill = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const {
            _id,
            price,
            discount,
            totalPrice,
            payInCash,
            payInOnline,
            totalPaid,
            dueAmount,
        } = req.body;
        if (
            _id == undefined ||
            price == undefined ||
            discount == undefined ||
            totalPrice == undefined ||
            payInCash == undefined ||
            payInOnline == undefined ||
            totalPaid == undefined ||
            dueAmount == undefined
        ) {
            throw new BadRequestError("कृपया सभी स्थान भरें");
        }
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const updateBill = await Bill.findByIdAndUpdate({ _id: _id }, {
            price: price,
            discount: discount,
            totalPrice: totalPrice,
            payInCash: payInCash,
            payInOnline: payInOnline,
            totalPaid: totalPaid,
            dueAmount: dueAmount,
        }, { new: true })
        res.status(StatusCodes.CREATED).json({ msg: "बदलाव सफल!" });
    } catch (error) {
        next(error);
    }
}


const createTreeNames = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const TreeNames = mongoose.model(
            "TreeNames" + req.user.userId,
            TreeNameSchema
        );
        const { treeNames, treeSizes } = req.body;
        if (!treeNames || !treeSizes) {
            throw new BadRequestError("कृपया सभी स्थान भरें");
        }
        const createdTreeNames = await TreeNames.create({
            treeNames,
            treeSizes,
        });
        res.status(StatusCodes.CREATED).json({ createdTreeNames });
    } catch (error) {
        next(error);
    }
};

const insertTreeName = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const {hindiName, englishName} = req.body;
        if(!hindiName || !englishName){
            throw new BadRequestError("कृपया हिंदी और अंग्रेजी नाम प्रदान करें")
        }
        const TreeNames = mongoose.model(
            "TreeNames" + req.user.userId,
            TreeNameSchema
        );
        const treeNamesObj = await TreeNames.findOne(
            {},
            {},
            { sort: { created_at: -1 } }
        );
        treeNamesObj.treeNames[hindiName]= englishName
        await TreeNames.updateMany({}, {$set: { "treeNames": treeNamesObj.treeNames }})
        res.status(StatusCodes.OK).json({ "msg": "बदलाव सफल!"});
    }catch(error) {
        next(error);
    }
}

const removeTreeName = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const {hindiName} = req.body;
        if(!hindiName){
            throw new BadRequestError("कृपया हिंदी नाम दें")
        }
        const TreeNames = mongoose.model(
            "TreeNames" + req.user.userId,
            TreeNameSchema
        );
        const treeNamesObj = await TreeNames.findOne(
            {},
            {},
            { sort: { created_at: -1 } }
        );
        delete treeNamesObj.treeNames[hindiName]
        await TreeNames.updateMany({}, {$set: { "treeNames": treeNamesObj.treeNames }})
        res.status(StatusCodes.OK).json({ "msg": "बदलाव सफल!"});
    }catch(error) {
        next(error);
    }
}
const insertTreeSize = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const {treeSize} = req.body;
        if(!treeSize){
            throw new BadRequestError("कृपया पेड़ का आकार प्रदान करें")
        }
        const TreeNames = mongoose.model(
            "TreeNames" + req.user.userId,
            TreeNameSchema
        );
        const treeNamesObj = await TreeNames.findOne(
            {},
            {},
            { sort: { created_at: -1 } }
        );
        treeNamesObj.treeSizes["("+treeSize+")"]= "("+treeSize+")"
        await TreeNames.updateMany({}, {$set: { "treeSizes": treeNamesObj.treeSizes }})
        res.status(StatusCodes.OK).json({ "msg": "बदलाव सफल!"});
    }catch(error) {
        next(error);
    }
}
const removeTreeSize = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const {treeSize} = req.body;
        if(!treeSize){
            throw new BadRequestError("कृपया पेड़ का आकार प्रदान करें")
        }
        const TreeNames = mongoose.model(
            "TreeNames" + req.user.userId,
            TreeNameSchema
        );
        const treeNamesObj = await TreeNames.findOne(
            {},
            {},
            { sort: { created_at: -1 } }
        );
        delete treeNamesObj.treeSizes[treeSize]
        await TreeNames.updateMany({}, {$set: { "treeSizes": treeNamesObj.treeSizes }})
        res.status(StatusCodes.OK).json({ "msg": "बदलाव सफल!"});
    }catch(error) {
        next(error);
    }
}

const getAllTreeNames = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner" && req.user.userRole !== "Staff") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        if (req.user.userRole === "Staff") {
            const user_username = req.body.username.slice(0, req.body.username.indexOf('.'));
            const user = await User.findOne({ username: user_username });
            if (!user) {
                throw new BadRequestError("आपका यूसरनेम गलत है")
            }
            req.user.userId = user._id.toString()
        }
        const TreeNames = mongoose.model(
            "TreeNames" + req.user.userId,
            TreeNameSchema
        );
        const treeNamesObj = await TreeNames.findOne(
            {},
            {},
            { sort: { created_at: -1 } }
        );
        if (!treeNamesObj) {
            throw new BadRequestError(
                "कोई पेड़ का नाम नहीं है"
            );
        }
        const { treeNames, treeSizes } = treeNamesObj;
        res.status(StatusCodes.OK).json({ treeNames, treeSizes });
    } catch (error) {
        next(error);
    }
    // res.send("Getting Tree Names Successfull");
};
const getAllBills = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const bills = await Bill.find({ createdBy: req.user.userId });
        res.status(StatusCodes.OK).json({
            bills,
        });
    } catch (error) {
        next(error);
    }
};
const getRecentBills = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const bills = await Bill.find({}, '-createdBy -__v').sort({ billDate: -1 }).limit(5);
        res.status(StatusCodes.OK).json({
            recentBills: bills,
        });
    } catch (error) {
        next(error);
    }
}
const getAllBillTrees = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { treeListId } = req.body;
        if (!treeListId) {
            throw new BadRequestError("कृपया वृक्ष सूची आईडी प्रदान करें");
        }
        const BillTree = mongoose.model(
            "BillTree" + req.user.userId,
            BillTreeSchema
        );
        const billTree = await BillTree.findOne({ _id: treeListId });

        res.status(StatusCodes.OK).json({ billTrees: billTree.treeList, _id: billTree._id });
    } catch (error) {
        next(error);
    }
};
const getBillsByDate = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            throw new BadRequestError("कृपया प्रारंभ समाप्ति तिथि प्रदान करें")
        }
        // let startDate = new Date(date)
        // let endDate = new Date()
        // endDate.setDate(startDate.getDate() + 1)
        // let start =  new Date(startDate).toISOString().split('T')[0]
        // let end = new Date(endDate).toISOString().split('T')[0]
        // console.log(startDate)
        // console.log(endDate)
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const bills = await Bill.find({
            billDate: {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            }
        }, '-createdBy -__v');
        res.status(StatusCodes.OK).json({
            filteredBills: bills,
        });
    } catch (error) {
        next(error)
    }
}
const getAmountsByMonth = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { year, month } = req.body;
        if (!month || !year) {
            throw new BadRequestError("कृपया माह और वर्ष प्रदान करें।")
        }
        var firstDay = new Date(parseInt(year), parseInt(month), 1);
        var lastDay = new Date(parseInt(year), parseInt(month) + 1, 0);
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const bills = await Bill.find({
            billDate: {
                $gte: firstDay,
                $lt: lastDay
            }
        }, 'totalPrice totalPaid dueAmount -_id');
        if(bills.length === 0 ){
            throw new BadRequestError("कोई रिकॉर्ड नहीं")
        }
        let amounts = {
            totalAmount : 0,
            totalPaid: 0,
            totalDue: 0
        }
        bills.forEach((bill)=> {
            amounts.totalAmount += bill.totalPrice
            amounts.totalPaid += bill.totalPaid
            amounts.totalDue += bill.dueAmount
        })
        res.status(StatusCodes.OK).json({
            amounts: amounts,
        });
    } catch (error) {
        next(error)
    }
}
const getBillsStartEndDate = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const firstRecord = await Bill.find({}, '-_id billDate').sort({ "billDate": 1 },).limit(1)
        const lastRecord = await Bill.find({}, '-_id billDate').sort({ "billDate": -1 },).limit(1)
        if (lastRecord.length === 0 || !firstRecord.length === 0) {
            throw new BadRequestError("कोई रिकॉर्ड नहीं")
        }
        let firstDate = new Date(firstRecord[0].billDate).toISOString().split('T')[0]
        let lastDate = new Date(lastRecord[0].billDate).toISOString().split('T')[0]
        res.status(StatusCodes.OK).json({
            startDate: firstDate.toString(), endDate: lastDate.toString()
        });
    } catch (error) {
        next(error)
    }
}
const getBillsStartEndMonthByYear = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { year } = req.body;
        if (!year) {
            throw new BadRequestError("कृपया वर्ष प्रदान करें")
        }
        let yearStart = new Date(parseInt(year), 0, 1)
        let yearEnd = new Date(parseInt(year), 11, 31)
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        const firstRecord = await Bill.find({
            billDate: {
                $gte: yearStart,
                $lt: yearEnd
            }
        },'-_id billDate').sort({"billDate": 1}, ).limit(1) 
        const lastRecord = await Bill.find({
            billDate: {
                $gte: yearStart,
                $lt: yearEnd
            }
        },'-_id billDate').sort({"billDate": -1},).limit(1) 

        console.log(firstRecord, lastRecord)
        if(lastRecord.length === 0 || !firstRecord.length === 0){
            throw new BadRequestError("कोई रिकॉर्ड नहीं")
        }
        let firstDate = new Date(firstRecord[0].billDate).getMonth()
        let lastDate = new Date(lastRecord[0].billDate).getMonth()
        res.status(StatusCodes.OK).json({
            startMonth: firstDate.toString(), endMonth: lastDate.toString()
        });
    } catch (error) {
        next(error)
    }
}
const getBillsByBillNoOrName = async (req, res, next) => {
    try {
        if (req.user.userRole !== "Owner") {
            throw new UnAuthenticatedError("प्रमाणीकरण अमान्य")
        }
        const { billNo, name } = req.body;
        console.log(billNo)
        console.log(name)
        if (!billNo && !name) {
            throw new BadRequestError("कृपया बिलनो या नाम प्रदान करें")
        }
        let billNoData = []
        let nameData = []
        const Bill = mongoose.model("Bill" + req.user.userId, BillSchema);
        if (billNo) {
            billNoData = await Bill.find({ billNo: billNo }, '-createdBy -__v').limit(10)
        }
        if (name) {
            nameData = await Bill.find({ "customerName": { $regex: '.*' + name + '.*' } }).limit(10)
        }
        res.status(StatusCodes.OK).json({
            filteredBills: [...billNoData, ...nameData]
        });
    } catch (error) {
        next(error)
    }
}
export {
    updateBill,
    createBill,
    getAllBills,
    getAllBillTrees,
    createTreeNames,
    getAllTreeNames,
    getRecentBills,
    getBillsByDate,
    getBillsStartEndDate,
    getBillsByBillNoOrName,
    getBillsStartEndMonthByYear,
    getAmountsByMonth,
    insertTreeName,
    insertTreeSize,
    removeTreeName,
    removeTreeSize
};
