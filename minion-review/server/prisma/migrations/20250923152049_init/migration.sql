-- CreateTable
CREATE TABLE "Minion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "bananaAffinity" INTEGER NOT NULL DEFAULT 0,
    "chaosLevel" INTEGER NOT NULL DEFAULT 0,
    "missionSuccess" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Minion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Villain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Villain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "minionId" INTEGER NOT NULL,
    "villainId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_minionId_fkey" FOREIGN KEY ("minionId") REFERENCES "Minion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_villainId_fkey" FOREIGN KEY ("villainId") REFERENCES "Villain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
