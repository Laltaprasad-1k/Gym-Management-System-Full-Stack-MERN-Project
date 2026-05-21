import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import connectDB from './config/database.js';
import { initRedis } from './services/redis.js';
import { initRabbitMQ } from './services/rabbitmq.js';
import authRoutes from './routes/auth.js';
import membersRoutes from './routes/members.js';
import workoutPlansRoutes from './routes/workoutPlans.js';
import membershipPlansRoutes from './routes/membershipPlans.js';
import paymentsRoutes from './routes/payments.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Initialize services
const initializeServices = async () => {
  await connectDB();
  await initRedis();
  await initRabbitMQ();
};

initializeServices().catch(error => {
  console.error(' Failed to initialize services:', error);
  process.exit(1);
});

// Routes
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/workout-plans', workoutPlansRoutes);
app.use('/api/membership-plans', membershipPlansRoutes);
app.use('/api/payments', paymentsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${config.FRONTEND_URL}`);
});
