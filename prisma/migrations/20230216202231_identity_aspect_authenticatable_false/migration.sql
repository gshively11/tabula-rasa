-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IdentityAspect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "authenticatable" BOOLEAN NOT NULL DEFAULT false,
    "identityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "IdentityAspect_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IdentityAspect" ("authenticatable", "createdAt", "deletedAt", "id", "identityId", "isDeleted", "type", "updatedAt", "value") SELECT "authenticatable", "createdAt", "deletedAt", "id", "identityId", "isDeleted", "type", "updatedAt", "value" FROM "IdentityAspect";
DROP TABLE "IdentityAspect";
ALTER TABLE "new_IdentityAspect" RENAME TO "IdentityAspect";
CREATE UNIQUE INDEX "IdentityAspect_type_value_key" ON "IdentityAspect"("type", "value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
