import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopName: String,
  bio: String,
  isApproved: {
    type: Boolean,
    default: false
  }
});

const Artisan = mongoose.model("Artisan", artisanSchema);
export default Artisan;
