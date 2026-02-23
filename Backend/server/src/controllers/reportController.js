const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCurrentBalance = async (req, res) => {
  const { baseId, equipmentId } = req.query;

  try {
    const inventory = await prisma.inventory.findUnique({
      where: {
        baseId_equipmentId: {
          baseId: Number(baseId),
          equipmentId: Number(equipmentId)
        }
      }
    });

    res.json({
      baseId,
      equipmentId,
      balance: inventory ? inventory.quantity : 0
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch balance" });
  }
};
exports.getOpeningBalance = async (req, res) => {
  const { baseId, equipmentId, date } = req.query;

  try {
    const movements = await prisma.assetMovement.findMany({
      where: {
        baseId: Number(baseId),
        equipmentId: Number(equipmentId),
        createdAt: {
          lt: new Date(date)
        }
      }
    });

    let balance = 0;

    movements.forEach(m => {
      if (["PURCHASE", "TRANSFER_IN"].includes(m.type)) {
        balance += m.quantity;
      } else {
        balance -= m.quantity;
      }
    });

    res.json({ openingBalance: balance });

  } catch (error) {
    res.status(500).json({ message: "Failed to calculate opening balance" });
  }
};
exports.getNetMovement = async (req, res) => {
  const { baseId, equipmentId, startDate, endDate } = req.query;

  try {
    const movements = await prisma.assetMovement.findMany({
      where: {
        baseId: Number(baseId),
        equipmentId: Number(equipmentId),
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    });

    let summary = {
      PURCHASE: 0,
      TRANSFER_IN: 0,
      TRANSFER_OUT: 0,
      ASSIGNMENT: 0,
      EXPENDED: 0
    };

    movements.forEach(m => {
      summary[m.type] += m.quantity;
    });

    const netChange =
      summary.PURCHASE +
      summary.TRANSFER_IN -
      summary.TRANSFER_OUT -
      summary.ASSIGNMENT -
      summary.EXPENDED;

    res.json({ summary, netChange });

  } catch (error) {
    res.status(500).json({ message: "Failed to calculate net movement" });
  }
};
exports.getMovementHistory = async (req, res) => {
  const { baseId, equipmentId } = req.query;

  try {
    const movements = await prisma.assetMovement.findMany({
      where: {
        baseId: Number(baseId),
        equipmentId: Number(equipmentId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(movements);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movement history" });
  }
};