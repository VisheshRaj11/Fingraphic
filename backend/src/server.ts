import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { ENV } from './config/env';
import { connectMongo } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { setupSocketIO } from './sockets/chatHandler';
import { initEmailCron } from './services/emailCron';

import authRoutes from './routes/authRoutes';
import analyzeRoutes from './routes/analyzeRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import digestRoutes from './routes/digestRoutes';
import userRoutes from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Attach io to app instance so REST controllers can emit live events
app.set('io', io);

// Global Middleware
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/chat', chatRoutes);

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
