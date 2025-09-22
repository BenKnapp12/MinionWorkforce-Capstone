# �‍♂️ Minion Review Portal

A full-stack web app where supervillains rate and review their minions.

## � Setup

### Backend
```
cd server
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### Frontend
```
cd client
npm install
npm run dev
```

## � Features

- React + Tailwind frontend
- Express + Prisma backend
- JWT authentication
- Redux Toolkit + RTK Query
- Seeded database with minions and villains
- Modular components and clean UX

## � Pages

-  Home
-  All reviews
-  Submit a review
-  Villain login

## � Testing

- Supertest for API
- Jest + React Testing Library for components

