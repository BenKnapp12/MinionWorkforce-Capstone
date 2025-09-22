const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const minions = await prisma.minion.findMany({ include: { reviews: true } });
  res.json(minions);
});

module.exports = router;
