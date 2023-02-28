-- CreateTable
CREATE TABLE "UserClicks" (
    "userId" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nextToken" TEXT NOT NULL,
    CONSTRAINT "UserClicks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClicks_userId_key" ON "UserClicks"("userId");
