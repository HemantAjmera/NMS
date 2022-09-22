import mongoose from "mongoose";

const BillTreeSchema = mongoose.Schema({
    treeList: {
        type: Object,
        required: [true, "Please provide Bill Tree List"],
    },
});
export default BillTreeSchema;
//export default mongoose.model("BillTree", BillTreeSchema);
