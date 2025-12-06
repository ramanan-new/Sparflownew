const express = require('express');
const router = express.Router();
const { Review } = require('../models');

router.get('/product/:productId', async (req, res) => {
  const reviews = await Review.findAll({ where: { productId: req.params.productId }, order: [['id','DESC']] });
  res.json(reviews);
});

router.post('/product/:productId', async (req, res) => {
  try {
    const { rating, title, body } = req.body;
    const productId = parseInt(req.params.productId, 10);
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
    const review = await Review.create({ productId, rating, title: title || '', body: body || '', userId: req.session.userId || null });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
