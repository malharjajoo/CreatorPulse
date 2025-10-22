import { Router } from 'express';
import { supabase } from '../database/supabase';
import { AuthenticatedRequest } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

const feedbackSchema = Joi.object({
  newsletter_id: Joi.string().uuid().required(),
  rating: Joi.string().valid('positive', 'negative').required(),
  comment: Joi.string().optional()
});

// Get feedback for a newsletter
router.get('/newsletter/:newsletterId', async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('newsletter_id', req.params.newsletterId)
      .eq('user_id', req.user!.id);

    if (error) throw error;

    res.json({ feedback: data });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Submit feedback
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { error: validationError, value } = feedbackSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: req.user!.id,
        ...value
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ feedback: data });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Update feedback
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { rating, comment } = req.body;

    const { data, error } = await supabase
      .from('feedback')
      .update({ rating, comment })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ feedback: data });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Delete feedback
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

export default router;
