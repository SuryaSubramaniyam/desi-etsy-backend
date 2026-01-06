import Review from "../models/review.js";


export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) return res.status(400).json({ message: "You already reviewed this product." });

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  res.status(201).json(review);
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// reviewController.js
// controllers/reviewController.js
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate("product", "name");
    res.status(200).json(reviews);
  } catch (err) {
    console.error("getMyReviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};



export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("product", "name");
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE a review — PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;

    await review.save();

    res.json({ message: "Review updated", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a review — DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
