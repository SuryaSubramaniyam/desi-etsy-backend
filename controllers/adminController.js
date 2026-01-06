import {User} from '../models/User.js';
import Artisan from '../models/Artisan.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/review.js';
// 1. Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// 2. Get all artisans
export const getAllArtisans = async (req, res) => {
  const artisans = await Artisan.find().populate('user', 'name email role');
  res.json(artisans);
};

// 3. Approve artisan
export const approveArtisan = async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) return res.status(404).json({ message: 'Artisan not found' });

  artisan.isApproved = true;
  await artisan.save();
  res.json({ message: 'Artisan approved' });
};

// 4. Toggle block/unblock user
export const toggleUserBlock = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
};

// 5. Get all products
// adminController.js
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("artisan", "shopName email name") // 👈 populate artisan
      .sort({ createdAt: -1 });


    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};
export const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // 10 orders per page
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();
  const orders = await Order.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
     .populate('user', 'name email') // ✅ Fix here
    .populate('items.product', 'title price'); 

  res.json({
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

   
// 6. Approve product
export const approveProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.isApproved = true;
  await product.save();
  res.json({ message: 'Product approved' });
};

// 7. Delete product
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Accepted", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  await order.save();

  res.json({ message: "Order status updated" });
};
// Get all reviews — for Admin Panel
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "title");

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Admin fetch reviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Delete any review — for Admin
export const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({ message: "Review deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const artisans = await User.countDocuments({ role: "artisan" });
    const products = await Product.countDocuments();
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    const pendingProducts = await Product.countDocuments({ isApproved: false });

    res.json({ totalUsers, totalOrders, totalRevenue, pendingProducts, artisans, products });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
