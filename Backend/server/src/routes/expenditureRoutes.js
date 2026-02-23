const express = require("express");
const router = express.Router();

const { createExpenditure } = require("../controllers/expenditureController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("ADMIN", "COMMANDER"), createExpenditure);

module.exports = router;