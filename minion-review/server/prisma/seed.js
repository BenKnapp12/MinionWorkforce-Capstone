import { PrismaClient } from '@prisma/client';
import migratePkg from '@prisma/migrate'; // ✅ CommonJS-safe import
const { Migrate } = migratePkg;

const prisma = new PrismaClient();

// ✅ Safe migration deploy without shell
try {
  const migrate = new Migrate();
  await migrate.deploy();
  console.log('✅ Prisma migrations deployed');
} catch (err) {
  console.warn('⚠️ Migration deploy failed (likely already applied or restricted). Proceeding with seed anyway.');
}

const minionData = [
  { name: 'Blarb', imageUrl: '/minions/Blarb.png' },
  { name: 'Choco', imageUrl: '/minions/Choco.png' },
  { name: 'Cupcake', imageUrl: '/minions/Cupcake.png' },
  { name: 'Kellybean', imageUrl: '/minions/Kellybean.png' },
  { name: 'Kevin', imageUrl: '/minions/kevin.png' },
  { name: 'Marcus', imageUrl: '/minions/Marcus.png' },
  { name: 'Marshy', imageUrl: '/minions/Marshy.png' },
  { name: 'Norbert', imageUrl: '/minions/Norbert.png' },
  { name: 'Pickles', imageUrl: '/minions/Pickles.png' },
  { name: 'Popcorn', imageUrl: '/minions/Popcorn.png' },
  { name: 'Tony', imageUrl: '/minions/Tony.png' },
  { name: 'Waffles', imageUrl: '/minions/Waffles.png' },
  { name: 'William', imageUrl: '/minions/William.png' }
];

const villainData = [
  { name: 'Gru', avatar: '😈', imageUrl: '/villains/Gru.jpg' },
  { name: 'Scarlet Overkill', avatar: '💄', imageUrl: '/villains/ScarletOverkill.png' },
  { name: 'Vector', avatar: '🧡', imageUrl: '/villains/Vector.png' },
  { name: 'El Macho', avatar: '💪', imageUrl: '/villains/ElMacho.png' },
  { name: 'Balthazar Bratt', avatar: '🎤', imageUrl: '/villains/BalthazarBratt.png' }
];

const positiveComments = [
  'Banana-powered brilliance!', 'Executed with precision.', 'Flawless infiltration.',
  'Handled gadgets like a veteran.', 'Too cute to be dangerous.', 'Outsmarted the villain twice.',
  'Strategic chaos deployment.', 'Exploded confetti instead of bombs.', 'Would hire again.',
  'Built a robot sidekick mid-mission.'
];

const neutralComments = [
  'Tested a new stealth serum.', 'Used a banana as a grappling hook.', 'Spoke fluent villainese.',
  'Wore a disguise made of marshmallows.', 'Knows when to vanish.', 'Reported back with partial intel.',
  'Mission went... okay.', 'Banana count inconclusive.', 'Left glitter in the jetpack.',
  'Needs a bit more training.'
];

const negativeComments = [
  'Set off the alarm... again.', 'Turned the villain’s lair into a bounce house.',
  'Accidentally cloned themselves.', 'Needs a leash and a muzzle.', 'Forgot the mission halfway through.',
  'Tripped over their own gadget.', 'Banana hoarding caused delays.', 'Chaos level exceeded safe limits.',
  'Blew up the exit tunnel.', 'Left the villain a thank-you note.'
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getSentiment(rating) {
  if (rating >= 4) return 'positive';
  if (rating === 3) return 'neutral';
  return 'negative';
}

function getComment(sentiment, minion) {
  const pool =
    sentiment === 'positive' ? positiveComments :
    sentiment === 'neutral' ? neutralComments :
    negativeComments;

  const prefix = ['Note:', 'Feedback:', 'Mission Log:', 'Observation:'];
  const traitComment =
    minion.chaosLevel > 8 ? 'Chaos levels off the charts.' :
    minion.bananaAffinity > 8 ? 'Banana obsession confirmed.' :
    minion.missionSuccess < 30 ? 'Needs serious retraining.' : '';

  const randomPrefix = prefix[getRandomInt(prefix.length)];
  const randomComment = pool[getRandomInt(pool.length)];

  return `[${sentiment.toUpperCase()}] ${randomPrefix} ${randomComment}${traitComment ? ' ' + traitComment : ''}`;
}

async function main() {
  await prisma.review.deleteMany();
  await prisma.minion.deleteMany();
  await prisma.villain.deleteMany();

  const villains = await Promise.all(
    villainData.map(({ name, avatar, imageUrl }) =>
      prisma.villain.create({
        data: { name, avatar, imageUrl }
      })
    )
  );

  const minions = await Promise.all(
    minionData.map(({ name, imageUrl }) =>
      prisma.minion.create({
        data: {
          name,
          imageUrl,
          chaosLevel: getRandomInt(10),
          bananaAffinity: getRandomInt(10),
          missionSuccess: getRandomInt(100)
        }
      })
    )
  );

  const reviews = [];
  for (let i = 0; i < 300; i++) {
    const minion = minions[getRandomInt(minions.length)];
    const villain = villains[getRandomInt(villains.length)];
    const rating = getRandomInt(5) + 1;
    const sentiment = getSentiment(rating);
    const comment = getComment(sentiment, minion);

    reviews.push(
      prisma.review.create({
        data: {
          rating,
          comment,
          minionId: minion.id,
          villainId: villain.id
        }
      })
    );
  }

  await Promise.all(reviews);
  console.log('🎉 Minions and villains seeded with avatars, images, and dynamic reviews!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());