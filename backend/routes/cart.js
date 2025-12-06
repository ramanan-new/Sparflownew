const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ cart: req.session.cart || [] });
});

router.post('/update', (req, res) => {
  const { cart } = req.body;
  req.session.cart = cart || [];
  res.json({ ok: true, cart: req.session.cart });
});

module.exports = router;
