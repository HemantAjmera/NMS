import mongoose from "mongoose";

const TreeNameSchema = mongoose.Schema({
    treeNames: {
        type: Object,
        required: [true, "please provide tree names list"],
    },
    treeSizes: {
        type: Object,
        required: [true, "please provide tree size list"],
    },
});

export default TreeNameSchema;
