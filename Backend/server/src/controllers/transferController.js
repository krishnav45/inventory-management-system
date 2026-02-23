const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTransfer = async (req, res) => {
  const { fromBaseId, toBaseId, equipmentId, quantity } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {

      // 1️⃣ Check stock availability
      const sourceInventory = await tx.inventory.findUnique({
        where: {
          baseId_equipmentId: {
            baseId: fromBaseId,
            equipmentId
          }
        }
      });

      if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new Error("Insufficient stock at source base");
      }

      // 2️⃣ Create Transfer record
      const transfer = await tx.transfer.create({
        data: {
          fromBaseId,
          toBaseId,
          equipmentId,
          quantity
        }
      });

      // 3️⃣ Deduct from source
      await tx.inventory.update({
        where: {
          baseId_equipmentId: {
            baseId: fromBaseId,
            equipmentId
          }
        },
        data: {
          quantity: {
            decrement: quantity
          }
        }
      });

      // 4️⃣ Add to destination
      await tx.inventory.upsert({
        where: {
          baseId_equipmentId: {
            baseId: toBaseId,
            equipmentId
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          baseId: toBaseId,
          equipmentId,
          quantity
        }
      });

      // 5️⃣ AssetMovement OUT
      const movementOut = await tx.assetMovement.create({
        data: {
          baseId: fromBaseId,
          equipmentId,
          quantity,
          type: "TRANSFER_OUT",
          createdBy: req.user.id
        }
      });

      // 6️⃣ AssetMovement IN
      await tx.assetMovement.create({
        data: {
          baseId: toBaseId,
          equipmentId,
          quantity,
          type: "TRANSFER_IN",
          referenceId: movementOut.id,
          createdBy: req.user.id
        }
      });

      return transfer;
    });

    res.status(201).json(result);

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};