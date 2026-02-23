const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // shows DB logs in console
});

module.exports = prisma;