import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js'; // ✅ adjust if needed

dotenv.config();

// 🔗 Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    return seedCategories();
  })
  .catch((err) => console.error('MongoDB connection failed:', err));

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

const seedCategories = async () => {
  try {
    await Category.deleteMany(); // Optional: clear old data
    const categoryData = categories.map((name) => ({ name }));
    await Category.insertMany(categoryData);
    console.log("✅ Categories seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
};
