-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IdentityAspect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "authenticatable" BOOLEAN NOT NULL,
    "identityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "IdentityAspect_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IdentityAspect" ("authenticatable", "createdAt", "deletedAt", "id", "identityId", "type", "updatedAt", "value") SELECT "authenticatable", "createdAt", "deletedAt", "id", "identityId", "type", "updatedAt", "value" FROM "IdentityAspect";
DROP TABLE "IdentityAspect";
ALTER TABLE "new_IdentityAspect" RENAME TO "IdentityAspect";
CREATE UNIQUE INDEX "IdentityAspect_type_value_key" ON "IdentityAspect"("type", "value");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identityId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "deletedAt", "id", "identityId", "password", "username") SELECT "createdAt", "deletedAt", "id", "identityId", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_identityId_key" ON "User"("identityId");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Organization" ("createdAt", "deletedAt", "id", "updatedAt") SELECT "createdAt", "deletedAt", "id", "updatedAt" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE TABLE "new_OrganizationalUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "OrganizationalUnit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationalUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OrganizationalUnit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrganizationalUnit" ("createdAt", "deletedAt", "description", "id", "name", "organizationId", "parentId", "updatedAt") SELECT "createdAt", "deletedAt", "description", "id", "name", "organizationId", "parentId", "updatedAt" FROM "OrganizationalUnit";
DROP TABLE "OrganizationalUnit";
ALTER TABLE "new_OrganizationalUnit" RENAME TO "OrganizationalUnit";
CREATE UNIQUE INDEX "OrganizationalUnit_name_organizationId_key" ON "OrganizationalUnit"("name", "organizationId");
CREATE TABLE "new_OrganizationPlan" (
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "activatedAt" DATETIME,
    "isActivated" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" DATETIME,
    "isDeactivated" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("organizationId", "planId"),
    CONSTRAINT "OrganizationPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrganizationPlan" ("activatedAt", "createdAt", "deactivatedAt", "organizationId", "planId") SELECT "activatedAt", "createdAt", "deactivatedAt", "organizationId", "planId" FROM "OrganizationPlan";
DROP TABLE "OrganizationPlan";
ALTER TABLE "new_OrganizationPlan" RENAME TO "OrganizationPlan";
CREATE TABLE "new_OrganizationPlanIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "OrganizationPlanIdentity_organizationId_planId_fkey" FOREIGN KEY ("organizationId", "planId") REFERENCES "OrganizationPlan" ("organizationId", "planId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationPlanIdentity_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrganizationPlanIdentity" ("createdAt", "deletedAt", "id", "identityId", "organizationId", "planId") SELECT "createdAt", "deletedAt", "id", "identityId", "organizationId", "planId" FROM "OrganizationPlanIdentity";
DROP TABLE "OrganizationPlanIdentity";
ALTER TABLE "new_OrganizationPlanIdentity" RENAME TO "OrganizationPlanIdentity";
CREATE TABLE "new_Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Plan" ("createdAt", "deletedAt", "id", "type", "updatedAt") SELECT "createdAt", "deletedAt", "id", "type", "updatedAt" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE INDEX "Plan_type_idx" ON "Plan"("type");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
