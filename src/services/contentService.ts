import axios from 'axios';
import Parser from 'rss-parser';
import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config/env';
import { supabase } from '../database/supabase';
import { ContentItem } from './aiService';

const rssParser = new Parser();
const twitterClient = new TwitterApi(config.twitter.bearerToken);

export const fetchTwitterContent = async (handle: string): Promise<ContentItem[]> => {
  try {
    // Get user by username
    const user = await twitterClient.v2.userByUsername(handle);
    
    if (!user.data) {
      throw new Error(`Twitter user @${handle} not found`);
    }

    // Get user's recent tweets
    const tweets = await twitterClient.v2.userTimeline(user.data.id, {
      max_results: 20,
      'tweet.fields': ['created_at', 'public_metrics', 'text']
    });

    return tweets.data.data?.map(tweet => ({
      id: tweet.id,
      source_id: '', // Will be set when saving to database
      title: `Tweet by @${handle}`,
      content: tweet.text,
      url: `https://twitter.com/${handle}/status/${tweet.id}`,
      published_at: tweet.created_at!,
      engagement_metrics: {
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0
      }
    })) || [];
  } catch (error) {
    console.error(`Error fetching Twitter content for @${handle}:`, error);
    return [];
  }
};

export const fetchYouTubeContent = async (channelId: string): Promise<ContentItem[]> => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: channelId,
        maxResults: 10,
        order: 'date',
        type: 'video',
        key: config.youtube.apiKey
      }
    });

    return response.data.items?.map((item: any) => ({
      id: item.id.videoId,
      source_id: '', // Will be set when saving to database
      title: item.snippet.title,
      content: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      published_at: item.snippet.publishedAt,
      engagement_metrics: {
        views: 0 // YouTube API doesn't provide view count in search results
      }
    })) || [];
  } catch (error) {
    console.error(`Error fetching YouTube content for channel ${channelId}:`, error);
    return [];
  }
};

export const fetchRSSContent = async (url: string): Promise<ContentItem[]> => {
  try {
    const feed = await rssParser.parseURL(url);
    
    return feed.items?.slice(0, 10).map(item => ({
      id: item.guid || item.link || '',
      source_id: '', // Will be set when saving to database
      title: item.title || '',
      content: item.contentSnippet || item.content || '',
      url: item.link || '',
      published_at: item.pubDate || new Date().toISOString(),
      engagement_metrics: {}
    })) || [];
  } catch (error) {
    console.error(`Error fetching RSS content from ${url}:`, error);
    return [];
  }
};

export const fetchAllUserContent = async (userId: string): Promise<ContentItem[]> => {
  try {
    // Get user's sources
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('*')
      .eq('user_id', userId);

    if (sourcesError) {
      throw sourcesError;
    }

    if (!sources || sources.length === 0) {
      return [];
    }

    const allContent: ContentItem[] = [];

    for (const source of sources) {
      let content: ContentItem[] = [];

      try {
        switch (source.type) {
          case 'twitter':
            content = await fetchTwitterContent(source.handle);
            break;
          case 'youtube':
            // Extract channel ID from URL or use handle as channel ID
            const channelId = source.url ? 
              source.url.split('/').pop() : source.handle;
            content = await fetchYouTubeContent(channelId);
            break;
          case 'rss':
            content = await fetchRSSContent(source.url || source.handle);
            break;
        }

        // Add source_id to each content item
        content.forEach(item => {
          item.source_id = source.id;
        });

        allContent.push(...content);
      } catch (error) {
        console.error(`Error fetching content for source ${source.id}:`, error);
        // Continue with other sources even if one fails
      }
    }

    // Save content to database
    if (allContent.length > 0) {
      const { error: saveError } = await supabase
        .from('content_items')
        .upsert(allContent, {
          onConflict: 'id'
        });

      if (saveError) {
        console.error('Error saving content to database:', saveError);
      }
    }

    return allContent;
  } catch (error) {
    console.error('Error fetching user content:', error);
    throw error;
  }
};

export const getRecentContent = async (userId: string, days: number = 7): Promise<ContentItem[]> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        sources!inner(user_id)
      `)
      .eq('sources.user_id', userId)
      .gte('published_at', cutoffDate.toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent content:', error);
    throw error;
  }
};
