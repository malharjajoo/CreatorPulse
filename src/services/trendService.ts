import { supabase } from '../database/supabase';
import { analyzeTrends } from './aiService';
import { getRecentContent } from './contentService';
import { Trend } from './aiService';

export const fetchTrends = async (userId: string): Promise<Trend[]> => {
  try {
    // Get recent content for trend analysis
    const recentContent = await getRecentContent(userId, 7);
    
    if (recentContent.length === 0) {
      return [];
    }

    // Analyze trends using AI
    const trends = await analyzeTrends(recentContent);

    // Save trends to database
    const trendsWithUserId = trends.map(trend => ({
      user_id: userId,
      title: trend.title,
      summary: trend.summary,
      keywords: trend.keywords
    }));

    const { data, error } = await supabase
      .from('trends')
      .insert(trendsWithUserId)
      .select();

    if (error) {
      console.error('Error saving trends:', error);
      return trends;
    }

    return data || trends;
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
};

export const getLatestTrends = async (userId: string, limit: number = 5): Promise<Trend[]> => {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching latest trends:', error);
    throw error;
  }
};
