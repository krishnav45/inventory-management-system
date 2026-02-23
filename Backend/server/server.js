require("dotenv").config();

const app = require("./src/app");
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const equipmentRoutes = require("./src/routes/equipmentRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const purchaseRoutes = require("./src/routes/purchaseRoutes");
const transferRoutes = require("./src/routes/transferRoutes");
const assignmentRoutes = require("./src/routes/assignmentRoutes");
const expenditureRoutes = require("./src/routes/expenditureRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const baseRoutes = require("./src/routes/baseRoutes");


const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/expenditure", expenditureRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/bases", baseRoutes);

console.log("JWT Secret:", process.env.JWT_SECRET);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("JWT Secret Loaded:", process.env.JWT_SECRET);
});