import Order from '../models/Order.js';
import razorpay from "../utils/razorpayInstance.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
// ✅ Correct way if using named export
import  User  from "../models/User.js";


// Place New Order
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, phone, paymentMethod } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod,
      phone,
    });

    // 🔍 Fetch user info
    const user = await User.findById(req.user._id);

    // 📧 Build HTML email
    const productList = items
      .map(
        (item) =>
          `<li>${item.quantity} x ${item.product?.name || "Product"}</li>`
      )
      .join("");

    const emailHtml = `
      <h2>Hi ${user.name},</h2>
      <p>🎉 Your order has been successfully placed!</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <h4>🛍️ Order Items:</h4>
      <ul>${productList}</ul>
      <p>Thank you for shopping at <strong>Desi Etsy</strong>!</p>
    `;

    await sendEmail(user.email, "Your Desi Etsy Order Confirmation", emailHtml);

    res.status(201).json(order);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Artisan Sales (products that belong to this artisan)
export const getSales = async (req, res) => {
  try {
    const orders = await Order.find({ 'products.product': { $exists: true } })
      .populate({
        path: 'products.product',
        match: { artisan: req.user._id }
      });

    const artisanOrders = orders.filter(order =>
      order.products.some(p => p.product && p.product.artisan?.toString() === req.user._id.toString())
    );

    res.json(artisanOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin or Artisan - Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow artisan (if they own the product) or admin
    const isAdmin = req.user.role === "admin";

    const isArtisan = order.items.some(
      (item) => item.product.artisan?.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isArtisan) {
      return res.status(403).json({ message: "Not authorized to update status" });
    }

    const { status } = req.body;

    const allowedStatuses = ["Accepted", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
// ✅ Add this to orderController.js if it's missing
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch my orders error:", err);
    res.status(500).json({ message: "Failed to fetch your orders." });
  }
};

// GET /api/orders/:id - Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price images artisan") // ✅ Add artisan!
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order." });
  }
};


// controllers/orderController.js


export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optional: Prevent canceling if it's already completed
    if (order.status === "Completed") {
      return res.status(400).json({ message: "Cannot cancel a completed order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order); // { id, amount, currency }
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// 🟢 Verify Payment (Optional security layer)
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Signature verification failed:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};