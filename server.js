import 'dotenv/config';
import express from 'express';
import Connect_Db from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import homeRoute from './routes/home_routes.js';
import adminRoutes from './routes/admin_routes.js';

const app = express();

// middlwares
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoute)
app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // connect database
  await Connect_Db();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer();
