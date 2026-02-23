const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createEquipment,
  getAllEquipment,
  updateEquipment,
  deleteEquipment
} = require("../controllers/equipmentController");


// CREATE (ADMIN only)
router.post("/", protect, authorize("ADMIN"), createEquipment);

// GET ALL (Logged users)
router.get("/", protect, getAllEquipment);

// UPDATE (ADMIN only)
router.put("/:id", protect, authorize("ADMIN"), updateEquipment);

// DELETE (ADMIN only)
router.delete("/:id", protect, authorize("ADMIN"), deleteEquipment);

module.exports = router;