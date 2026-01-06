// seedArtisans.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import  User  from "./models/User.js"; // adjust the path as needed

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB");

const artisans = [
  {
    name: "Artisan One",
    email: "artisan@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "9876543210",
    role: "artisan",
    shopName: "Divine Crafts",
    bio: "Creating soulful, handmade crafts inspired by Indian tradition.",
  },
  {
    name: "Artisan Two",
    email: "artisan2@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "9876543211",
    role: "artisan",
    shopName: "Rustic Handlooms",
    bio: "Handwoven stories passed down through generations.",
  },
  {
    name: "Artisan Three",
    email: "artisan3@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "9876543212",
    role: "artisan",
    shopName: "Color Threads",
    bio: "Vibrant, colorful embroidery with a cultural touch.",
  },
  {
    name: "Artisan Four",
    email: "artisan4@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "9876543213",
    role: "artisan",
    shopName: "Nature Touch",
    bio: "Eco-friendly handcrafted goods from bamboo, clay, and jute.",
  },
  {
    name: "Artisan Five",
    email: "artisan5@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    phone: "9876543214",
    role: "artisan",
    shopName: "Timeless Arts",
    bio: "Preserving ancient Indian art forms with love and detail.",
  },
];

try {
  await User.insertMany(artisans);
  console.log("✅ Artisan users inserted with shopName and bio!");
  process.exit();
} catch (err) {
  console.error("❌ Artisan seeding failed:", err);
  process.exit(1);
}
