const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createAssignment = async (req, res) => {
  const { baseId, equipmentId, quantity, personnel } = req.body;

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
        throw new Error("Insufficient stock for assignment");
      }

      // 2️⃣ Create Assignment record
      const assignment = await tx.assignment.create({
        data: {
          baseId,
          equipmentId,
          quantity,
          personnel
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

      // 4️⃣ Asset Movement record
      await tx.assetMovement.create({
        data: {
          baseId,
          equipmentId,
          quantity,
          type: "ASSIGNMENT",
          createdBy: req.user.id
        }
      });

      return assignment;
    });

    res.status(201).json(result);

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};