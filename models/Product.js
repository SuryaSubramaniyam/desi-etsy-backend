import mongoose  from "mongoose";

const productSchema = new mongoose.Schema({
   title: { type: String, required: true },

    artisan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artisan",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: String,
    images: [String],
    shopName: String,
    isApproved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;