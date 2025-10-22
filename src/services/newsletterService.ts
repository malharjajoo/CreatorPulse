import { supabase } from '../database/supabase';
import { generateNewsletterContent, extractWritingStyle } from './aiService';
import { getRecentContent } from './contentService';
import { getLatestTrends } from './trendService';
import { sendNewsletterEmail } from './emailService';

export const generateNewsletter = async (userId: string): Promise<any> => {
  try {
    // Get user's timezone
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('timezone')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
    }

    // Get recent content
    const recentContent = await getRecentContent(userId, 7);
    
    // Get latest trends
    const trends = await getLatestTrends(userId, 5);

    // Get user's writing samples
    const { data: writingSamples, error: samplesError } = await supabase
      .from('writing_samples')
      .select('content')
      .eq('user_id', userId);

    if (samplesError) {
      console.error('Error fetching writing samples:', samplesError);
    }

    // Extract writing style
    const writingStyle = await extractWritingStyle(
      writingSamples?.map(sample => sample.content) || []
    );

    // Generate newsletter content
    const content = await generateNewsletterContent(
      trends,
      recentContent,
      writingStyle,
      user?.timezone || 'UTC'
    );

    // Save newsletter to database
    const { data: newsletter, error: saveError } = await supabase
      .from('newsletters')
      .insert({
        user_id: userId,
        content
      })
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    return newsletter;
  } catch (error) {
    console.error('Error generating newsletter:', error);
    throw error;
  }
};

export const sendNewsletter = async (newsletterId: string): Promise<boolean> => {
  try {
    // Get newsletter and user info
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .select(`
        *,
        users!inner(email, name)
      `)
      .eq('id', newsletterId)
      .single();

    if (newsletterError || !newsletter) {
      throw new Error('Newsletter not found');
    }

    // Send email
    const emailSent = await sendNewsletterEmail(
      newsletter.users.email,
      newsletter.users.name,
      newsletter.content
    );

    if (emailSent) {
      // Update newsletter as sent
      const { error: updateError } = await supabase
        .from('newsletters')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', newsletterId);

      if (updateError) {
        console.error('Error updating newsletter sent_at:', updateError);
      }
    }

    return emailSent;
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return false;
  }
};

export const getNewsletterStats = async (userId: string): Promise<any> => {
  try {
    const { data: newsletters, error } = await supabase
      .from('newsletters')
      .select(`
        id,
        created_at,
        sent_at,
        feedback(rating)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const stats = {
      total: newsletters?.length || 0,
      sent: newsletters?.filter(n => n.sent_at).length || 0,
      drafts: newsletters?.filter(n => !n.sent_at).length || 0,
      positive_feedback: 0,
      negative_feedback: 0
    };

    newsletters?.forEach(newsletter => {
      newsletter.feedback?.forEach((fb: any) => {
        if (fb.rating === 'positive') {
          stats.positive_feedback++;
        } else if (fb.rating === 'negative') {
          stats.negative_feedback++;
        }
      });
    });

    return stats;
  } catch (error) {
    console.error('Error getting newsletter stats:', error);
    throw error;
  }
};
