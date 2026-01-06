import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String, unique: true
    },
    phone: String,
    profileImage: String,
    password: String,
    role: {
        type: String, enum: ["user", "artisan", "admin"], default: "user"
    },
    isBlocked: {
  type: Boolean,
  default: false
}

});

export const User = mongoose.model('User', userSchema);
export default User;