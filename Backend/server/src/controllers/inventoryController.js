const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add inventory to a base (ADMIN only)
exports.addInventory = async (req, res) => {
  const { baseId, equipmentId, quantity } = req.body;

  try {
    // Check if record already exists
    const existing = await prisma.inventory.findFirst({
      where: { baseId, equipmentId }
    });

    let inventory;

    if (existing) {
      // Update quantity
      inventory = await prisma.inventory.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity
        }
      });
    } else {
      // Create new inventory record
      inventory = await prisma.inventory.create({
        data: { baseId, equipmentId, quantity }
      });
    }

    res.status(201).json(inventory);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View all inventory
exports.getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        base: true,
        equipment: true
      }
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};