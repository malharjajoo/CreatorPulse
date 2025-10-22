import { Router } from 'express';
import { supabase } from '../database/supabase';
import { AuthenticatedRequest } from '../middleware/auth';
import { fetchTrends } from '../services/trendService';

const router = Router();

// Get all trends for user
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ trends: data });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get latest trends
router.get('/latest', async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    res.json({ trends: data });
  } catch (error) {
    console.error('Error fetching latest trends:', error);
    res.status(500).json({ error: 'Failed to fetch latest trends' });
  }
});

// Fetch new trends
router.post('/fetch', async (req: AuthenticatedRequest, res) => {
  try {
    const trends = await fetchTrends(req.user!.id);
    
    res.status(201).json({ trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;
