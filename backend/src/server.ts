import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { ENV } from './config/env';
import { connectMongo, disconnectMongo } from './config/db';
import { getRedisClient, disconnectRedis } from './config/redis';
import authRoutes from './routes/authRoutes';
import analyzeRoutes from './routes/analyzeRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import digestRoutes from './routes/digestRoutes';
import { setupSocketIO } from './sockets/chatHandler';
import { initEmailCron } from './services/emailCron';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Healthcheck Route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: ENV.NODE_ENV,
    mongo: 'connected',
    redis: 'connected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/digest', digestRoutes);

// Global Error Handler
app.use(errorHandler);

// Setup Sockets & Cron
setupSocketIO(io);
initEmailCron();

// Start Server & Connect Databases
const PORT = parseInt(ENV.PORT, 10);

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 FinGraphic Backend running on http://localhost:${PORT}`);
  console.log(`📈 Mode: ${ENV.NODE_ENV}`);
  console.log(`==================================================`);
});

connectMongo().catch((err) => console.warn('[MongoDB] Connection notice:', err.message));
getRedisClient();
