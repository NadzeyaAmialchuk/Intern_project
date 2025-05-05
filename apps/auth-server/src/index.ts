
const express = require("express");
const dotenv = require("dotenv");
const prisma = require('./config/prisma.config')

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

prisma.$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });