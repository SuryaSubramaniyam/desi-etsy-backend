import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: Number,
    address: String,
    phone: Number,
    status: {
      type: String,
     enum: ["Pending", "Accepted", "Shipped", "Delivered", "Cancelled"],

      default: "Pending",
    },
    paymentMethod: String,
    
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
