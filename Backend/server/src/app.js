const express = require("express");
const prisma = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test Route
app.get("/", async (req, res) => {
  try {
    await prisma.$connect();
    res.send("🪖 Military Asset Management API + DB Connected ✅");
  } catch (error) {
    res.status(500).send("Database connection failed ❌");
  }
});

module.exports = app;