import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Artisan from '../models/Artisan.js';

export const register = async (req, res) => {
  const { name, email, password, role, phone, shopName } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create user account
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // 2. If artisan, also create Artisan profile
    if (role === "artisan") {
      await Artisan.create({
        user: user._id,
        isApproved: false, // default to false
         shopName: shopName || `${name}'s Shop`,// or collect shopName from form
      });
    }

    res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
