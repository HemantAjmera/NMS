import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
const StaffSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please Provide OwnerId"],
    },
    role: {
        type: String,
        required: true,
        default: "Staff"
    },
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
                return validator.matches(username, "^[a-zA-Z0-9_]+[.]+[a-zA-Z0-9_]*$")
            },
            message: " Please provide valid staff username",
        },
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
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
});

StaffSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, userRole: "Staff" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};

StaffSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = candidatePassword === this.password
    return isMatch;
};

export default StaffSchema;
