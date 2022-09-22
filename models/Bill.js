import mongoose from "mongoose";
import AutoIncrement from "mongoose";
const BillSchema = mongoose.Schema(
    {
        billNo: {
            type: Number,
            required: [true, "Please provide Bill No"],
            unique: true,
        },
        customerName: { type: String },
        customerNumber: {type: String },
        price: { type: Number, required: [true, "Please provide Bill Price"] },
        loadingCharge: {
            type: Number,
            required: [true, "Please provide Bill Loading Charge"],
        },
        discount: {
            type: Number,
            required: [true, "Please provide Bill Discount"],
        },
        totalPrice: {
            type: Number,
            required: [true, "Please provide Bill Total Price"],
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Online", "Cash-Online"],
            default: "Cash",
        },
        billDate: { type: Date, default: Date.now },
        payInCash: {
            type: Number,
            required: [true, "Please provide Bill Amount Pay In Cash"],
        },
        payInOnline: {
            type: Number,
            required: [true, "Please provide Bill Amount Pay In Online"],
        },
        totalPaid: {
            type: Number,
            required: [true, "Please provide Bill Total Paid"],
        },
        dueAmount: {
            type: Number,
            required: [true, "Please provide Bill Total Due"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
        treeListId: {
            type: mongoose.Types.ObjectId,
            ref: "BillTree",
            required: [true, "Please provide Tree List"],
        },
    },
    { timeStamps: true }
);
export default BillSchema;
//export default mongoose.model("Bill", BillSchema);
