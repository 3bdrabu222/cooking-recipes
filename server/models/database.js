const mongoose = require('mongoose');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://alshrafi1999:EqbVU5U8PLOgE5gO@cluster1.pci4p.mongodb.net/recipe_blog?retryWrites=true&w=majority';

// Mongoose configuration
mongoose.set('strictQuery', false);

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB Atlas successfully');
}).catch((err) => {
  console.error('MongoDB Atlas connection error:', err.message);
  process.exit(1); // Exit if we can't connect to the database
});

const db = mongoose.connection;

// Handle connection events
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

db.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

db.once('open', async function(){
  console.log('Database connection successful');
  
  try {
    await insertDummyData();
  } catch(error) {
    console.error('Error inserting dummy data:', error.message);
  }
});

// Models
require('./Category');
require('./Recipe');

// Insert dummy data
async function insertDummyData() {
  const Category = require('./Category');
  const Recipe = require('./Recipe');

  try {
    // Check if data already exists
    const existingCategories = await Category.countDocuments();
    const existingRecipes = await Recipe.countDocuments();

    if (existingCategories > 0 || existingRecipes > 0) {
      console.log('Data already exists in database, skipping dummy data insertion');
      return;
    }

    // Insert categories
    const categories = await Category.insertMany([
      { name: 'Thai', image: 'thai-food.jpg' },
      { name: 'American', image: 'american-food.jpg' },
      { name: 'Chinese', image: 'chinese-food.jpg' },
      { name: 'Mexican', image: 'mexican-food.jpg' },
      { name: 'Indian', image: 'indian-food.jpg' }
    ]);

    console.log('Categories inserted successfully');

    // Insert recipes
    await Recipe.insertMany([
      {
        name: 'Thai Green Curry',
        description: 'A fragrant Thai green curry with coconut milk.',
        email: 'test@test.com',
        ingredients: ['Coconut milk', 'Green curry paste', 'Chicken', 'Bamboo shoots', 'Thai basil'],
        category: 'Thai',
        image: 'thai-green-curry.jpg'
      },
      {
        name: 'Pad Thai',
        description: 'Classic Thai stir-fried rice noodles.',
        email: 'test@test.com',
        ingredients: ['Rice noodles', 'Tofu', 'Bean sprouts', 'Peanuts', 'Tamarind sauce'],
        category: 'Thai',
        image: 'veggie-pad-thai.jpg'
      },
      {
        name: 'Burger',
        description: 'Classic American burger with all the fixings.',
        email: 'test@test.com',
        ingredients: ['Beef patty', 'Bun', 'Lettuce', 'Tomato', 'Cheese'],
        category: 'American',
        image: 'southern-friend-chicken.jpg'
      },
      {
        name: 'Apple Pie',
        description: 'Traditional American apple pie.',
        email: 'test@test.com',
        ingredients: ['Apples', 'Pie crust', 'Cinnamon', 'Sugar', 'Butter'],
        category: 'American',
        image: 'key-lime-pie.jpg'
      },
      {
        name: 'Kung Pao Chicken',
        description: 'Spicy stir-fried chicken with peanuts.',
        email: 'test@test.com',
        ingredients: ['Chicken', 'Peanuts', 'Dried chilies', 'Soy sauce', 'Green onions'],
        category: 'Chinese',
        image: 'spring-rolls.jpg'
      }
    ]);

    console.log('Recipes inserted successfully');
  } catch(error) {
    console.error('Error inserting dummy data:', error.message);
    throw error; // Re-throw to be caught by the caller
  }
}
