import mongoose from 'mongoose'

const DraftBillSchema = mongoose.Schema({
    staffId: {
        type: mongoose.Types.ObjectId,
        ref: "Staff",
        required: [true, "Please Provide Staff Id"]
    },
    staffName: {
        type: String,
        required: [true, "Please Provide Staff Name"]
    },
    customerName: {
        type: String,
        required: [true, "Please Provide Customer Name"]
    },
    customerNumber: {
        type: String,
    },
    billItemsList: {
        type: Array,
        required: [true, "Please Provide Bill Tree List"]
    },
    createdAt: { type: Date, expires: '60m', default: Date.now }
})

export default DraftBillSchema;