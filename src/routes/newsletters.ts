import { Router } from 'express';
import { supabaseAdmin } from '../database/supabase';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateNewsletter } from '../services/newsletterService';

const router = Router();

// Get all newsletters for user
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ newsletters: data });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

// Get newsletter stats
router.get('/stats', async (req: AuthenticatedRequest, res) => {
  try {
    // Get total newsletters count
    const { count: totalNewsletters, error: countError } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user!.id);

    if (countError) throw countError;

    // Get sent newsletters count
    const { count: sentNewsletters, error: sentError } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user!.id)
      .not('sent_at', 'is', null);

    if (sentError) throw sentError;

    // Get recent newsletters (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentNewsletters, error: recentError } = await supabaseAdmin
      .from('newsletters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user!.id)
      .gte('created_at', sevenDaysAgo.toISOString());

    if (recentError) throw recentError;

    res.json({
      total_newsletters: totalNewsletters || 0,
      sent_newsletters: sentNewsletters || 0,
      recent_newsletters: recentNewsletters || 0,
      open_rate: 0, // TODO: Calculate from feedback
      click_rate: 0 // TODO: Calculate from feedback
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter stats' });
  }
});

// Get specific newsletter
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;

    res.json({ newsletter: data });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter' });
  }
});

// Generate new newsletter
router.post('/generate', async (req: AuthenticatedRequest, res) => {
  try {
    const newsletter = await generateNewsletter(req.user!.id);
    
    res.status(201).json({ newsletter });
  } catch (error) {
    console.error('Error generating newsletter:', error);
    res.status(500).json({ error: 'Failed to generate newsletter' });
  }
});

// Update newsletter
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const { data, error } = await supabase
      .from('newsletters')
      .update({ content })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ newsletter: data });
  } catch (error) {
    console.error('Error updating newsletter:', error);
    res.status(500).json({ error: 'Failed to update newsletter' });
  }
});

// Delete newsletter
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { error } = await supabase
      .from('newsletters')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;

    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

export default router;
