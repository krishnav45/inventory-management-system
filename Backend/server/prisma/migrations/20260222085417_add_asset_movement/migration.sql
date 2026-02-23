-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('PURCHASE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ASSIGNMENT', 'EXPENDED');

-- CreateTable
CREATE TABLE "AssetMovement" (
    "id" SERIAL NOT NULL,
    "baseId" INTEGER NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" "MovementType" NOT NULL,
    "referenceId" INTEGER,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetMovement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetMovement" ADD CONSTRAINT "AssetMovement_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetMovement" ADD CONSTRAINT "AssetMovement_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetMovement" ADD CONSTRAINT "AssetMovement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
