/*
  Warnings:

  - A unique constraint covering the columns `[baseId,equipmentId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventory_baseId_equipmentId_key" ON "Inventory"("baseId", "equipmentId");
