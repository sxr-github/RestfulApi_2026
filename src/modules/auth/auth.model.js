import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
    
},{timestamps: true}
)

// this block of code decribe how a password is encrypted when before saving it to the db
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

//comparing the encrypted password with the users password stored in db

userSchema.methods.comparePassword = async function (clearTextPassword) {
    return bcrypt.compare(clearTextPassword, this.password)
}

export default mongoose.model("User", userSchema)