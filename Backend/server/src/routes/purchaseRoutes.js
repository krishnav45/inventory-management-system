const express = require("express");
const router = express.Router();

const {
  createPurchase,
  getAllPurchases
} = require("../controllers/purchaseController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// CREATE
router.post("/", protect, authorize("ADMIN", "LOGISTICS"), createPurchase);

// GET ALL
router.get("/", protect, getAllPurchases);

module.exports = router;