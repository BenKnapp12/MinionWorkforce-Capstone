const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const minions = await prisma.minion.findMany({
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' } // optional: sort reviews newest first
        }
      }
    });

    res.status(200).json(minions);
  } catch (err) {
    console.error('Error fetching minions:', err);
    res.status(500).json({ error: 'Failed to fetch minions' });
  }
});

module.exports = router;