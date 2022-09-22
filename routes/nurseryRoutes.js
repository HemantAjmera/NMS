import express from "express";

const router = express.Router();

import {
    createBill,
    getAllBills,
    getBillsByDate,
    getAllBillTrees,
    getBillsStartEndDate,
    getBillsByBillNoOrName,
    getBillsStartEndMonthByYear,
    getAllTreeNames,
    createTreeNames,
    getRecentBills,
    updateBill,
    getAmountsByMonth,
    insertTreeName,
    insertTreeSize,
    removeTreeName,
    removeTreeSize
} from "../controllers/nurseryController.js";

router.route("/").post(createBill).get(getAllBills);
router.route("/getBillsByDate").post(getBillsByDate)
router.route("/getAmountsByMonth").post(getAmountsByMonth)
router.route("/getBillsStartEndDate").get(getBillsStartEndDate)
router.route("/getBillsByBillNoOrName").post(getBillsByBillNoOrName)
router.route("/getBillsStartEndMonthByYear").post(getBillsStartEndMonthByYear)
router.route("/updateBill").post(updateBill)
router.route("/getRecentBills").get(getRecentBills)
router.route("/singleBillTrees").post(getAllBillTrees);
router.route("/treeNames").post(createTreeNames)
router.route("/getTreeNames").post(getAllTreeNames);
router.route("/insertTreeName").post(insertTreeName)
router.route('/removeTreeName').post(removeTreeName)
router.route("/insertTreeSize").post(insertTreeSize)
router.route('/removeTreeSize').post(removeTreeSize)
export default router;
