-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "financialCapacity" TEXT,
ADD COLUMN     "interestType" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "source" TEXT;

-- CreateTable
CREATE TABLE "Workgroup" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workgroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientNote" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkgroupMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WorkgroupMembers_AB_unique" ON "_WorkgroupMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkgroupMembers_B_index" ON "_WorkgroupMembers"("B");

-- AddForeignKey
ALTER TABLE "Workgroup" ADD CONSTRAINT "Workgroup_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientNote" ADD CONSTRAINT "ClientNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkgroupMembers" ADD CONSTRAINT "_WorkgroupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Workgroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkgroupMembers" ADD CONSTRAINT "_WorkgroupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkspaceMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
