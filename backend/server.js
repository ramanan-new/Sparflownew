const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const { sequelize, User, Product } = require('./models');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'sparflow-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve static frontend from sibling folder 'frontend'
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback to frontend index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function init() {
  await sequelize.sync();

  // Seed sample data if none
  const count = await Product.count();
  if (count === 0) {
    const sampleProducts = require('./seed/sample-products');
    await Product.bulkCreate(sampleProducts);
    console.log('Seeded products');
  }

  app.listen(PORT, () => {
    console.log(`Sparflow backend running on http://localhost:${PORT}`);
  });
}

init().catch(err => {
  console.error('Failed to start', err);
});
