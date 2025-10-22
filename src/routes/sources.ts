import { Router } from 'express';
import { supabaseAdmin } from '../database/supabase';
import { AuthenticatedRequest } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

const sourceSchema = Joi.object({
  type: Joi.string().valid('twitter', 'youtube', 'rss').required(),
  handle: Joi.string().required(),
  url: Joi.string().uri().optional()
});

// Get all sources for user
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('sources')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ sources: data });
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

// Add new source
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { error: validationError, value } = sourceSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    console.log('Creating source ...');
    const { data, error } = await supabaseAdmin
      .from('sources')
      .insert({
        user_id: req.user!.id,
        ...value
      })
      .select()
      .single();

    if (error) throw error;
    console.log('data:', data);
    console.log('Source created successfully');

    res.status(201).json({ source: data });
  } catch (error) {
    console.error('Error creating source:', error);
    res.status(500).json({ error: 'Failed to create source' });
  }
});

// Update source
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { error: validationError, value } = sourceSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { data, error } = await supabaseAdmin
      .from('sources')
      .update(value)
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ source: data });
  } catch (error) {
    console.error('Error updating source:', error);
    res.status(500).json({ error: 'Failed to update source' });
  }
});

// Delete source
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('sources')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;

    res.json({ message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Error deleting source:', error);
    res.status(500).json({ error: 'Failed to delete source' });
  }
});

export default router;
