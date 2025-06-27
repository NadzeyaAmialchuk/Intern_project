
// const express = require("express");
// const dotenv = require("dotenv");
// const prisma = require('./config/prisma.config')
// const authController = require('./controllers/auth.controller');
// const { errorHandler } = require('./middlewares/error.middleware');

// dotenv.config();

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 3001;

// app.use('/auth', authController);

// app.use(errorHandler);


// prisma.$connect()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err: Error) => {
//     console.error('Database connection failed:', err);
//     process.exit(1);
//   });

const express = require("express");
const dotenv = require("dotenv");
const prisma = require('./config/prisma.config');
const { redisClient, connectRedis } = require('./config/redis.config');
const authController = require('./controllers/auth.controller');
const { errorHandler } = require('./middlewares/error.middleware');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use('/auth', authController);

app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

startServer();