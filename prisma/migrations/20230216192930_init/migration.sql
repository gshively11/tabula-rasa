-- CreateTable
CREATE TABLE "Identity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Identity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IdentityAspect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "authenticatable" BOOLEAN NOT NULL,
    "identityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "IdentityAspect_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "OrganizationalUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    CONSTRAINT "OrganizationalUnit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationalUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OrganizationalUnit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "OrganizationPlan" (
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "activatedAt" DATETIME,
    "deactivatedAt" DATETIME,

    PRIMARY KEY ("organizationId", "planId"),
    CONSTRAINT "OrganizationPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrganizationPlanIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "OrganizationPlanIdentity_organizationId_planId_fkey" FOREIGN KEY ("organizationId", "planId") REFERENCES "OrganizationPlan" ("organizationId", "planId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationPlanIdentity_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identityId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "User_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "Identity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_IdentityToOrganizationalUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_IdentityToOrganizationalUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "Identity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IdentityToOrganizationalUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "OrganizationalUnit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentityAspect_type_value_key" ON "IdentityAspect"("type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationalUnit_name_organizationId_key" ON "OrganizationalUnit"("name", "organizationId");

-- CreateIndex
CREATE INDEX "Plan_type_idx" ON "Plan"("type");

-- CreateIndex
CREATE UNIQUE INDEX "User_identityId_key" ON "User"("identityId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_IdentityToOrganizationalUnit_AB_unique" ON "_IdentityToOrganizationalUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_IdentityToOrganizationalUnit_B_index" ON "_IdentityToOrganizationalUnit"("B");
