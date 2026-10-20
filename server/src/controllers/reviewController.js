import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;

    const review = await Review.create({
      mealCode,
      rating,
      comment,
      reviewedBy,
    });

    return res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    return res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getPopularMeals = async (req, res, next) => {
  try {
    let minReviews = 2;

    if (req.query.minReviews !== undefined) {
      const parsed = Number(req.query.minReviews);
      
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return res.status(400).json({ message: 'minReviews must be a positive integer' });
      }

      minReviews = parsed;
    }

    const popular = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          reviewCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      {
        $match: {
          reviewCount: { $gte: minReviews },
        },
      },
      {
        $sort: {
          reviewCount: -1,
          _id: 1, // Sort by mealCode ascending on tie
        },
      },
      {
        $project: {
          _id: 0,
          mealCode: '$_id',
          reviewCount: 1,
          averageRating: 1,
        },
      },
    ]);

    return res.status(200).json({ popular });
  } catch (err) {
    next(err);
  }
};