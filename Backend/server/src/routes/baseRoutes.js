const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Only ADMIN can create base
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    res.json({ message: "Base created" });
  }
);

// ADMIN + COMMANDER can view
router.get(
  "/",
  protect,
  authorize("ADMIN", "COMMANDER"),
  async (req, res) => {
    res.json({ message: "Bases list" });
  }
);

module.exports = router;