const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const reviews = await prisma.review.findMany({ include: { minion: true, villain: true } });
  res.json(reviews);
});

router.post('/', async (req, res) => {
  const { rating, comment, minionId, villainId } = req.body;
  const review = await prisma.review.create({ data: { rating, comment, minionId, villainId } });
  res.json(review);
});

module.exports = router;
