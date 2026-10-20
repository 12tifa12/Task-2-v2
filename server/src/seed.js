import mongoose from 'mongoose';
import 'dotenv/config';
import Review from './models/Review.js';

const dummyReviews = [
  { mealCode: 'ML101', rating: 5, comment: 'Delicious pasta!' },
  { mealCode: 'ML101', rating: 4, comment: 'Great flavor, generous portion.' },
  { mealCode: 'ML101', rating: 4, comment: 'Solid meal overall.' },
  { mealCode: 'ML101', rating: 4, comment: 'Loved it.' },
  { mealCode: 'ML202', rating: 3, comment: 'Average burger.' },
  { mealCode: 'ML202', rating: 3, comment: 'Could use more sauce.' },
  { mealCode: 'ML303', rating: 5, comment: 'Best sushi ever!' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews.');

    // Insert dummy reviews
    const inserted = await Review.insertMany(dummyReviews);
    console.log(`Successfully seeded ${inserted.length} reviews!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();