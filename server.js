import 'dotenv/config';
import express from 'express';
import Connect_Db from './database/db.js';
import authRoutes from './routes/UserRoutes.js';

const app = express();

// middlwares
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // connect database
  await Connect_Db();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer();
