const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecting to seed data...');

    // 1. Clear existing (Optional - be careful)
    // await User.deleteMany();
    // await Product.deleteMany();

    // 2. Create Admin User
    const adminExists = await User.findOne({ email: 'admin@bagify.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Master Admin',
        email: 'admin@bagify.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin User Created: admin@bagify.com / admin123');
    }

    // 3. Create Sample Product with SEO
    const productExists = await Product.findOne({ slug: 'classic-leather-backpack' });
    if (!productExists) {
      await Product.create({
        name: 'Classic Leather Backpack',
        description: 'A premium, handcrafted leather backpack for daily use.',
        price: 120,
        category: 'Backpacks',
        stock: 15,
        slug: 'classic-leather-backpack',
        metaTitle: 'Premium Leather Backpack - Handcrafted Quality | Bagify',
        metaDescription: 'Buy our handcrafted premium leather backpack. Perfect for school, work, or travel.',
        metaKeywords: ['leather', 'backpack', 'luxury', 'bag']
      });
      console.log('✅ Sample SEO Product Created');
    }

    console.log('Done! Press Ctrl+C to exit.');
  } catch (err) {
    console.error(err);
  }
};

seed();
