const express = require('express');
const router = express.Router();
const { Product, Review } = require('../models');

router.get('/', async (req, res) => {
  const { category, q } = req.query;
  const where = {};
  if (category) where.category = category;
  if (q) where.name = { [require('sequelize').Op.like]: `%${q}%` };
  const products = await Product.findAll({ where, order: [['id', 'ASC']] });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

module.exports = router;
