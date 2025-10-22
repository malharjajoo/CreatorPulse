import { Express } from 'express';
import authRoutes from './auth';
import sourceRoutes from './sources';
import newsletterRoutes from './newsletters';
import trendRoutes from './trends';
import feedbackRoutes from './feedback';
import { authenticateUser } from '../middleware/auth';

export const setupRoutes = (app: Express) => {
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Public routes
  app.use('/api/auth', authRoutes);
  
  // Protected routes
  app.use('/api/sources', authenticateUser, sourceRoutes);
  app.use('/api/newsletters', authenticateUser, newsletterRoutes);
  app.use('/api/trends', authenticateUser, trendRoutes);
  app.use('/api/feedback', authenticateUser, feedbackRoutes);
};
