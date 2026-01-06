
// seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB");

// Sample 50 handicraft categories
const categories = [
  "Wood Carving", "Clay Pottery", "Handloom Sarees", "Bamboo Craft",
  "Terracotta Art", "Jute Bags", "Block Printing", "Dokra Art",
  "Miniature Painting", "Warli Painting", "Phulkari Embroidery", "Chikankari",
  "Pattachitra", "Brassware", "Leather Puppets", "Lac Bangles",
  "Stone Carving", "Shell Craft", "Rogan Art", "Meenakari",
  "Blue Pottery", "Bidriware", "Mirror Work", "Zardozi",
  "Tanjore Painting", "Emboss Painting", "Kalamkari", "Beadwork",
  "Silk Thread Jewelry", "Tie and Dye", "Tribal Jewelry", "Madhubani Painting",
  "Palm Leaf Engraving", "Bone Inlay", "Woolen Toys", "Recycled Paper Craft",
  "Embroidery Frames", "Bamboo Furniture", "Handwoven Rugs", "Brass Lamps",
  "Macramé Decor", "Copper Utensils", "Wooden Toys", "Metal Sculptures",
  "Handcrafted Journals", "Ceramic Planters", "Puppet Dolls", "Hand Fans",
  "Iron Wall Art", "Vintage Bells"
];

// Sample product titles per category
const generateTitle = (category) =>
  `${category} - Handmade ${["Art", "Craft", "Piece", "Design"][Math.floor(Math.random() * 4)]}`;

const getRandomPrice = () => Math.floor(Math.random() * 1200) + 300;

const getImageForCategory = (category) =>
  `https://source.unsplash.com/featured/?${encodeURIComponent(category)},handmade`;

try {
  const artisans = await User.find({ role: "artisan" });

  if (artisans.length === 0) throw new Error("No artisans found in DB.");

  const products = [];

  for (const artisan of artisans) {
    for (let i = 0; i < 10; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const title = generateTitle(category);
      const price = getRandomPrice();

      products.push({
        title,
        name: title,
        artisan: artisan._id,
        description: `Beautifully handcrafted ${category.toLowerCase()} by ${artisan.shopName}.`,
        price,
        category,
        images: [getImageForCategory(category)],
        shopName: artisan.shopName,
        isApproved: true,
      });
    }
  }

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products inserted successfully!`);
  process.exit();
} catch (err) {
  console.error("❌ Product seeding failed:", err);
  process.exit(1);
}
