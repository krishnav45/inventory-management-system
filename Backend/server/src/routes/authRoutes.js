const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/admin-only", protect, authorize("ADMIN"), (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
    user: req.user
  });
});

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});


module.exports = router;