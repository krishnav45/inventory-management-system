const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


router.get(
  "/admin-only",
  protect,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user
    });
  }
);


router.get("/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

module.exports = router;