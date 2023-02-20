-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserClicks" (
    "userId" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "nextToken" TEXT NOT NULL,
    CONSTRAINT "UserClicks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserClicks" ("clickCount", "createdAt", "nextToken", "updatedAt", "userId") SELECT "clickCount", "createdAt", "nextToken", "updatedAt", "userId" FROM "UserClicks";
DROP TABLE "UserClicks";
ALTER TABLE "new_UserClicks" RENAME TO "UserClicks";
CREATE UNIQUE INDEX "UserClicks_userId_key" ON "UserClicks"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
