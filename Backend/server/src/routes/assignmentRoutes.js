const express = require("express");
const router = express.Router();

const { createAssignment } = require("../controllers/assignmentController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("ADMIN", "COMMANDER"), createAssignment);

module.exports = router;