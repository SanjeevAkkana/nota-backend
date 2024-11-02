import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        photo: String,
        otp: String,
        password: String,
        verified: { type: Boolean, default: false }
    }
)

const User = mongoose.model('User', userSchema)

export default User