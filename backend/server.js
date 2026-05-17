const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Note: Switched to Local JSON Database for smooth local execution
// Database Service logic is now handled in individual controllers

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow cross-origin requests from React
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Bagify API is running...');
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
