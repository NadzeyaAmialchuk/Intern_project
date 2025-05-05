import app from './app';
import prisma from './prisma/prisma.config';


const PORT = process.env.PORT || 3001;

prisma.$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });