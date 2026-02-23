const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Equipment (ADMIN only)
exports.createEquipment = async (req, res) => {
  const { name, type } = req.body;

  try {
    const equipment = await prisma.equipment.create({
      data: { name, type }
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Equipment (Any logged-in user)
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    const updated = await prisma.equipment.update({
      where: { id: Number(id) },
      data: { name, type }
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.equipment.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};