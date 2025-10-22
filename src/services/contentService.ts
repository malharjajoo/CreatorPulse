import axios from 'axios';
import Parser from 'rss-parser';
import { config } from '../config/env';
import { supabase } from '../database/supabase';
import { ContentItem } from './aiService';

const rssParser = new Parser();

export const fetchTwitterContent = async (handle: string): Promise<ContentItem[]> => {
  try {
    // Use Twitter RSS feed (nitter or similar service)
    // Note: Twitter doesn't provide official RSS, so we'll use a third-party service
    const rssUrl = `https://nitter.net/${handle}/rss`;
    
    const feed = await rssParser.parseURL(rssUrl);
    
    return feed.items?.slice(0, 20).map(item => ({
      id: item.guid || item.link || '',
      source_id: '', // Will be set when saving to database
      title: item.title || `Tweet by @${handle}`,
      content: item.contentSnippet || item.content || '',
      url: item.link || '',
      published_at: item.pubDate || new Date().toISOString(),
      engagement_metrics: {}
    })) || [];
  } catch (error) {
    console.error(`Error fetching Twitter RSS for @${handle}:`, error);
    return [];
  }
};

export const fetchYouTubeContent = async (channelId: string): Promise<ContentItem[]> => {
  try {
    // Use YouTube RSS feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    
    const feed = await rssParser.parseURL(rssUrl);
    
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
    console.error(`Error fetching YouTube RSS for channel ${channelId}:`, error);
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
