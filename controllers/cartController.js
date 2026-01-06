import CartItem from "../models/Cart.js";
import Product from "../models/Product.js";

// Add to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if already in cart
    const existing = await CartItem.findOne({ user: userId, product: productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const newItem = await CartItem.create({
      user: userId,
      product: productId,
      quantity,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all cart items for a user
export const getCartItems = async (req, res) => {
  const userId = req.user.id;

  try {
    const items = await CartItem.find({ user: userId }).populate("product");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = req.body.quantity;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Clear all items from cart
// ✅ Clear all items from a user's cart
// cartController.js
export const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user.id });
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Clear cart failed:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

