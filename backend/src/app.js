import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import cvsRoutes from './routes/cvs.js';

const app = express();

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvsRoutes);
app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  jwtSecret: !!process.env.JWT_SECRET,
  mongoUri: !!process.env.MONGODB_URI,
}));

export default app;
