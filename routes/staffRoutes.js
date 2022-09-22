import express from "express";

const router = express.Router();

import {
    createDraftBill,
    getDraftBills,
    deleteDraftBill
} from "../controllers/staffController.js";

router.route("/draftBill").post(createDraftBill).get(getDraftBills)
router.route('/deleteDraftBill').post(deleteDraftBill)
export default router;
