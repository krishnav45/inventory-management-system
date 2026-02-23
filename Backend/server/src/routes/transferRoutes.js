const express = require("express");
const router = express.Router();

const { createTransfer } = require("../controllers/transferController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("ADMIN", "LOGISTICS"), createTransfer);

module.exports = router;