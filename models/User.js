import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Please provide username"],
        minlength: 6,
        maxlength: 30,
        validate: {
            validator: function (username) {
                return validator.matches(username, "^[a-zA-Z0-9_]*$")
            },
            message: " Please provide valid username",
        },
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        default: "Staff"
    },
    lastName: {
        type: String,
        maxlength: 20,
        trim: true,
        default: "",
    },
    active: {
        type: Boolean,
        default: false,
    },
    nurseryName: {
        type: String,
        default: "",
        trim: true,
        maxlength: 80,
    },
    nurseryAddress: {
        type: String,
        defalut: "",
        trim: true,
        maxlength: 80,
    },
    nurseryLocation: {
        type: String,
        default: "",
        trim: true,
        maxlength: 80,
    },
    mobileNumbers: {
        type: Array,
        default: [],
        trim: true,
    },
});
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, userRole: "Owner" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};
export default mongoose.model("User", UserSchema);
