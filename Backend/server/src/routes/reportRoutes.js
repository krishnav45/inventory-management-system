const express = require("express");
const router = express.Router();

const { getCurrentBalance } = require("../controllers/reportController");
const protect = require("../middleware/authMiddleware");
const { getOpeningBalance } = require("../controllers/reportController");
const { getNetMovement } = require("../controllers/reportController");
const { getMovementHistory } = require("../controllers/reportController");

router.get("/net-movement", protect, getNetMovement);
router.get("/balance", protect, getCurrentBalance);
router.get("/opening-balance", protect, getOpeningBalance);
router.get("/history", protect, getMovementHistory);

module.exports = router;