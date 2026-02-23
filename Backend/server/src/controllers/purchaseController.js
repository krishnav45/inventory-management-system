const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// ✅ CREATE PURCHASE
exports.createPurchase = async (req, res) => {
  const { baseId, equipmentId, quantity } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {

      // 1️⃣ Create Purchase record
      const purchase = await tx.purchase.create({
        data: {
          baseId,
          equipmentId,
          quantity
        }
      });

      // 2️⃣ Create AssetMovement record
      await tx.assetMovement.create({
        data: {
          baseId,
          equipmentId,
          quantity,
          type: "PURCHASE",
          createdBy: req.user.id
        }
      });

      // 3️⃣ Update Inventory
      await tx.inventory.upsert({
        where: {
          baseId_equipmentId: {
            baseId,
            equipmentId
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          baseId,
          equipmentId,
          quantity
        }
      });

      return purchase;
    });

    res.status(201).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Purchase failed" });
  }
};


// ✅ GET ALL PURCHASES  (OUTSIDE createPurchase)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        base: true,
        equipment: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};