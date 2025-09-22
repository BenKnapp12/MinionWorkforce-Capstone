import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const minionData = [
  { name: 'Blarb', imageUrl: 'http://localhost:3000/minions/Blarb.png' },
  { name: 'Choco', imageUrl: 'http://localhost:3000/minions/Choco.png' },
  { name: 'Cupcake', imageUrl: 'http://localhost:3000/minions/Cupcake.png' },
  { name: 'Kellybean', imageUrl: 'http://localhost:3000/minions/Kellybean.png' },
  { name: 'Kevin', imageUrl: 'http://localhost:3000/minions/kevin.png' }, // ✅ lowercase filename
  { name: 'Marcus', imageUrl: 'http://localhost:3000/minions/Marcus.png' },
  { name: 'Marshy', imageUrl: 'http://localhost:3000/minions/Marshy.png' },
  { name: 'Norbert', imageUrl: 'http://localhost:3000/minions/Norbert.png' },
  { name: 'Pickles', imageUrl: 'http://localhost:3000/minions/Pickles.png' },
  { name: 'Popcorn', imageUrl: 'http://localhost:3000/minions/Popcorn.png' },
  { name: 'Tony', imageUrl: 'http://localhost:3000/minions/Tony.png' },
  { name: 'Waffles', imageUrl: 'http://localhost:3000/minions/Waffles.png' },
  { name: 'William', imageUrl: 'http://localhost:3000/minions/William.png' }
];

const villainNames = ['Gru', 'Scarlet Overkill', 'Vector', 'El Macho', 'Balthazar Bratt'];

const comments = [
  'Absolutely loyal!', 'Needs more training.', 'Banana enthusiast.', 'Surprisingly clever.',
  'Caused minor explosion.', 'Perfect for stealth missions.', 'Too chaotic.', 'Great with gadgets.',
  'Sings too much.', 'Would hire again.', 'Needs supervision.', 'Excellent teamwork.'
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  await prisma.review.deleteMany();
  await prisma.minion.deleteMany();
  await prisma.villain.deleteMany();

  const villains = await Promise.all(
    villainNames.map((name) =>
      prisma.villain.create({
        data: {
          name,
          avatar: `https://robohash.org/${name}?set=set2&bgset=bg1`,
          imageUrl: `https://robohash.org/${name}?set=set2&bgset=bg1`
        }
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
    const comment = comments[getRandomInt(comments.length)];

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
  console.log('🎉 Minions seeded with your custom avatars!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());