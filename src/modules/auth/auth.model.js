import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 20,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"] ,
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ["customer", "seller", "admin"],
        default: "customer"
    },
    isVerified: {
        type: Boolean,
        dafault: false
    },
    verificationToken: {
        type: String,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpiresToken: {
        type: Date,
        select: false
    }
    
},{timestamps: true})

export default mongoose.model("User", userSchema)