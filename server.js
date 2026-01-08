import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const __dirname = path.resolve(); // ✅ Fix for static path in ES Modules

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://desi-etsy-frontend-v2-l7l79okjl-surya-ss-projects-2e8e98a2.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ THIS LINE IS CRITICAL
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artisan', artisanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);

// ✅ Static file serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// MongoDB connection
const PORT = process.env.PORT || 8888;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // 🔥 REQUIRED for Render
  });
