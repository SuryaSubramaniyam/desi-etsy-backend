import Product from "../models/Product.js";



export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category,  } = req.body;
    const artisan = req.user._id;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`; // This will be served statically

    const product = await Product.create({
       title: name,
      artisan,
      name,
      description,
      price,
      category,
      images: [imagePath],
      status: "pending",
      isApproved: false,
    });

    res.status(201).json({ message: "Product submitted", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
    } = req.query;

    const filter = { isApproved: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    // console.log("🔍 Search query:", search);
    // console.log("🧾 Final filter object:", filter);

    const products = await Product.find(filter)
      .populate("artisan")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// productController.js
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    const product = await Product.findOne({
      _id: req.params.id,
      artisan: req.user._id,
    });

    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    product.title = title || product.title;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      product.images = [imagePath];
    }

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      artisan: req.user._id,
    });

    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
