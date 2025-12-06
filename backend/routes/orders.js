const express = require('express');
const router = express.Router();
const { Order, Product } = require('../models');

router.post('/checkout', async (req, res) => {
  try {
    const { items, paymentMethod, guest } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Cart empty' });

    const ids = items.map(i => i.id);
    const products = await Product.findAll({ where: { id: ids } });
    let total = 0;
    const detailed = items.map(it => {
      const p = products.find(x => x.id === it.id);
      if (!p) return null;
      const price = p.price * (1 - (p.offerPercent || 0) / 100);
      const line = { id: p.id, name: p.name, qty: it.qty, price: price, subtotal: price * it.qty };
      total += line.subtotal;
      return line;
    }).filter(Boolean);

    const order = await Order.create({
      userId: req.session.userId || null,
      items: JSON.stringify(detailed),
      total,
      paymentMethod: paymentMethod || 'unknown',
      status: 'processing',
      meta: JSON.stringify({ guest: guest || null })
    });

    res.json({ ok: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

module.exports = router;
