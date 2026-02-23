const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createExpenditure = async (req, res) => {
  const { baseId, equipmentId, quantity, reason } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {

      // 1️⃣ Check stock
      const inventory = await tx.inventory.findUnique({
        where: {
          baseId_equipmentId: {
            baseId,
            equipmentId
          }
        }
      });

      if (!inventory || inventory.quantity < quantity) {
        throw new Error("Insufficient stock for expenditure");
      }

      // 2️⃣ Create Expenditure record
      const expenditure = await tx.expenditure.create({
        data: {
          baseId,
          equipmentId,
          quantity,
          reason
        }
      });

      // 3️⃣ Deduct Inventory
      await tx.inventory.update({
        where: {
          baseId_equipmentId: {
            baseId,
            equipmentId
          }
        },
        data: {
          quantity: {
            decrement: quantity
          }
        }
      });

      // 4️⃣ AssetMovement record
      await tx.assetMovement.create({
        data: {
          baseId,
          equipmentId,
          quantity,
          type: "EXPENDED",
          createdBy: req.user.id
        }
      });

      return expenditure;
    });

    res.status(201).json(result);

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};