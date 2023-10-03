import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//pre is a method that allows us to do something before saving to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { //if we're saving some data without messing with the password, we just move on!
        next();
    } 
    this.password = await bcrypt.hash(this.password, 10);
})

const User = mongoose.model("User", userSchema);

export default User;