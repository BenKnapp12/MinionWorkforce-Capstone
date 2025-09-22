import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

// 🔐 JWT Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// 🟡 GET Minions with trait filters
app.get('/minions', async (req, res) => {
  const { name, chaosLevel, bananaAffinity, missionSuccess } = req.query;
  try {
    const minions = await prisma.minion.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        chaosLevel: chaosLevel ? parseInt(chaosLevel) : undefined,
        bananaAffinity: bananaAffinity ? parseInt(bananaAffinity) : undefined,
        missionSuccess: missionSuccess ? parseInt(missionSuccess) : undefined
      },
      include: { reviews: true }
    });
    res.json(minions);
  } catch (error) {
    console.error('Error fetching minions:', error);
    res.status(500).json({ error: 'Failed to fetch minions' });
  }
});

// 🟣 GET Villains with optional name filter
app.get('/villains', async (req, res) => {
  const { name } = req.query;
  try {
    const villains = await prisma.villain.findMany({
      where: name ? { name: { contains: name, mode: 'insensitive' } } : {},
      include: { reviews: true }
    });
    res.json(villains);
  } catch (error) {
    console.error('Error fetching villains:', error);
    res.status(500).json({ error: 'Failed to fetch villains' });
  }
});

// 🔵 GET Reviews with filters and minion traits
app.get('/reviews', async (req, res) => {
  const { minion, villain, rating } = req.query;
  try {
    const reviews = await prisma.review.findMany({
      where: {
        rating: rating ? parseInt(rating) : undefined,
        minion: minion ? { name: { contains: minion, mode: 'insensitive' } } : undefined,
        villain: villain ? { name: { contains: villain, mode: 'insensitive' } } : undefined
      },
      include: {
        minion: {
          select: {
            name: true,
            imageUrl: true,
            chaosLevel: true,
            bananaAffinity: true,
            missionSuccess: true
          }
        },
        villain: {
          select: {
            name: true
          }
        }
      }
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// 📝 POST Review (JWT protected)
app.post('/reviews', verifyToken, async (req, res) => {
  const { rating, comment, minionId, villainId } = req.body;
  try {
    const review = await prisma.review.create({
      data: { rating, comment, minionId, villainId }
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// 📊 Dashboard Stats
app.get('/dashboard', async (req, res) => {
  try {
    const totalMinions = await prisma.minion.count();
    const totalVillains = await prisma.villain.count();
    const totalReviews = await prisma.review.count();
    const avgRating = await prisma.review.aggregate({ _avg: { rating: true } });

    res.json({
      totalMinions,
      totalVillains,
      totalReviews,
      averageRating: avgRating._avg.rating?.toFixed(2) || 'N/A'
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// 🏆 Villain Leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const villains = await prisma.villain.findMany({ include: { reviews: true } });

    const ranked = villains.map(v => {
      const total = v.reviews.length;
      const avg = total ? v.reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;
      return {
        name: v.name,
        avatar: v.avatar,
        imageUrl: v.imageUrl,
        totalReviews: total,
        averageRating: avg.toFixed(2)
      };
    }).sort((a, b) => b.averageRating - a.averageRating);

    res.json(ranked);
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// ❤️ Health Check
app.get('/health', (req, res) => {
  res.send('OK');
});

// ✅ Port binding for Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});