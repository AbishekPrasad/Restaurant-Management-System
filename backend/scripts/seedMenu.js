const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  await MenuItem.insertMany([
    {
      name: 'Margherita Pizza',
      description: 'Classic cheese pizza with tomato and basil',
      ingredients: ['cheese', 'tomato', 'basil'],
      image: 'https://ooni.com/cdn/shop/articles/20220211142347-margherita-9920_ba86be55-674e-4f35-8094-2067ab41a671.jpg?crop=center&height=800&v=1737104576&width=800',
      amount: 199,
      category: 'veg'
    },
    {
      name: 'Veg Burger',
      description: 'Fresh bun with veg patty and cheese',
      ingredients: ['bun', 'lettuce', 'cheese', 'veg patty'],
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4PvD5A7PopG8NcjwDxdjKt3_NGY5VrxQxnQ&s',
      amount: 149,
      category: 'veg'
    },
    {
      name: 'Fried Rice',
      description: 'Delicious fried rice with veggies',
      ingredients: ['rice', 'capsicum', 'onion', 'soy sauce'],
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQgyPzwI6HVnwLQX1ZH-2jcfqtPGYrv8vcpA&s',
      amount: 129,
      category: 'veg'
    },
    {
      name: 'Paneer Wrap',
      description: 'Spicy paneer roll with sauces',
      ingredients: ['paneer', 'tortilla', 'onion', 'capsicum'],
      image: 'https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-Featured-1.jpg',
      amount: 99,
      category: 'veg'
    },
    {
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice cooked with marinated chicken and spices',
      ingredients: ['chicken', 'basmati rice', 'spices', 'yogurt'],
      image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg',
      amount: 249,
      category: 'non-veg'
    },
    {
      name: 'Masala Dosa',
      description: 'Crispy dosa filled with spicy potato filling',
      ingredients: ['rice batter', 'potato', 'onion', 'spices'],
      image: 'https://www.cookwithmanali.com/wp-content/uploads/2020/05/Masala-Dosa.jpg',
      amount: 89,
      category: 'veg'
    },
    {
      name: 'Tandoori Chicken',
      description: 'Chicken legs marinated in spices and grilled',
      ingredients: ['chicken', 'yogurt', 'spices'],
      image: 'https://sinfullyspicy.com/wp-content/uploads/2014/07/1200-by-1200-images-2.jpg',
      amount: 299,
      category: 'non-veg'
    },
    {
      name: 'Chole Bhature',
      description: 'Spicy chickpeas with deep-fried bread',
      ingredients: ['chickpeas', 'flour', 'onion', 'tomato'],
      image: 'https://via.placeholder.com/150',
      amount: 109,
      category: 'veg'
    },
    {
      name: 'Pasta Alfredo',
      description: 'Creamy pasta with Alfredo sauce and herbs',
      ingredients: ['pasta', 'cream', 'garlic', 'cheese'],
      image: 'https://i.etsystatic.com/48764677/r/il/304c02/6670169374/il_1588xN.6670169374_58r7.jpg',
      amount: 159,
      category: 'veg'
    }
  ]);

  console.log('Sample menu inserted');
  mongoose.disconnect();
});
