const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  addInventory,
  getInventory
} = require("../controllers/inventoryController");

// Only ADMIN can modify inventory
router.post("/", protect, authorize("ADMIN"), addInventory);

// All logged in users can view
router.get("/", protect, getInventory);

module.exports = router;