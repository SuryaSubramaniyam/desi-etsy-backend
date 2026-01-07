// File: controllers/artisanController.js ✅ FINAL VERSION
import Artisan from '../models/Artisan.js';
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Review from '../models/review.js';

// -------------------------------------
// 🚀 Artisan Registration Request
// -------------------------------------
export const requestArtisan = async (req, res) => {
  try {
    const existing = await Artisan.findOne({ user: req.user.id });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const artisan = await Artisan.create({
      user: req.user.id,
      shopName: req.body.shopName,
      bio: req.body.bio,
    });

    res.status(201).json(artisan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------
// 👩‍⚖️ Admin: View All Pending Artisans
// -------------------------------------
export const getPendingArtisans = async (req, res) => {
  try {
    const pending = await Artisan.find({ isApproved: false }).populate('user', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------
// 👩‍⚖️ Admin: Approve Artisan
// -------------------------------------
export const approveArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) return res.status(404).json({ message: 'Artisan not found' });

    artisan.isApproved = true;
    await artisan.save();

    res.json({ message: 'Artisan approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------
// 📦 Artisan Dashboard: My Orders
// -------------------------------------
export const getMyOrders = async (req, res) => {
  try {
    // ✅ Step 1: Get this artisan's products
    const myProducts = await Product.find({ artisan: req.user._id }).select("_id name price");
    const myProductIds = myProducts.map(p => p._id.toString());

    if (myProductIds.length === 0) {
      return res.json([]); // No products = No orders
    }

    // ✅ Step 2: Get all orders and populate
    const allOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price artisan");

    // ✅ Step 3: Filter only orders that include this artisan’s products
    const filteredOrders = allOrders.map(order => {
      const filteredItems = order.items.filter(item =>
        item.product && myProductIds.includes(item.product._id.toString())
      );

      if (filteredItems.length > 0) {
        const totalAmount = filteredItems.reduce((sum, item) => {
          const price = item.product?.price || 0;
          const qty = item.quantity || 1;
          return sum + price * qty;
        }, 0);

        return {
          _id: order._id,
          user: order.user,
          items: filteredItems,
          totalAmount,
          address: order.address,
          phone: order.phone,
          paymentMethod: order.paymentMethod,
          status: order.status,
          createdAt: order.createdAt,
        };
      }

      return null;
    }).filter(Boolean); // Remove nulls

    res.json(filteredOrders);
  } catch (err) {
    console.error("Artisan order fetch error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// -------------------------------------
// 🌟 Artisan Dashboard: Reviews for My Products
// -------------------------------------
export const getReviewsForMyProducts = async (req, res) => {
  try {
    const myProducts = await Product.find({ artisan: req.user._id }).select("_id");
    const myProductIds = myProducts.map(p => p._id);

    const reviews = await Review.find({ product: { $in: myProductIds } })
      .populate("user", "name")
      .populate("product", "name");

    res.json(reviews);
  } catch (err) {
    console.error("Artisan review fetch error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getArtisanDashboardStats = async (req, res) => {
  try {
    const artisanId = req.user._id;

    // Total products by this artisan
    const totalProducts = await Product.countDocuments({ artisan: artisanId });

    // Orders that include this artisan's products
    const allOrders = await Order.find({ status: { $ne: "Cancelled" } }).populate("items.product");

    // Filter orders containing at least 1 product from this artisan
    const artisanOrders = allOrders.filter(order =>
      order.items.some(i => i.product?.artisan?.toString() === artisanId.toString())
    );

    // Total revenue from delivered orders
    let totalRevenue = 0;
    artisanOrders.forEach(order => {
      if (order.status === "Delivered") {
        order.items.forEach(i => {
          if (i.product?.artisan?.toString() === artisanId.toString()) {
            totalRevenue += i.product.price * i.quantity;
          }
        });
      }
    });

    // Average rating (optional)
    const reviews = await Review.find().populate("product", "artisan rating");
    const artisanReviews = reviews.filter(r => r.product?.artisan?.toString() === artisanId.toString());

    const avgRating = artisanReviews.length
      ? artisanReviews.reduce((sum, r) => sum + r.rating, 0) / artisanReviews.length
      : 0;

    res.json({
      totalProducts,
      totalOrders: artisanOrders.length,
      totalRevenue,
      avgRating: avgRating.toFixed(1),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch artisan stats" });
  }
};
export const getAllArtisans = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const artisans = await Artisan.find()
      .select("shopName location bio profilePic") // ✅ Only needed fields
      .limit(limit);

    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch artisans", error: err.message });
  }
};