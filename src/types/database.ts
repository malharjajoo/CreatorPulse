export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  created_at: string;
}

export interface Source {
  id: string;
  user_id: string;
  type: 'twitter' | 'youtube' | 'rss';
  handle: string;
  url?: string;
  created_at: string;
}

export interface WritingSample {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Trend {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  keywords: string[];
  created_at: string;
}

export interface Newsletter {
  id: string;
  user_id: string;
  content: string;
  sent_at?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  newsletter_id: string;
  user_id: string;
  rating: 'positive' | 'negative';
  comment?: string;
  created_at: string;
}

export interface ContentItem {
  id: string;
  source_id: string;
  title: string;
  content: string;
  url: string;
  published_at: string;
  engagement_metrics?: {
    likes?: number;
    retweets?: number;
    views?: number;
  };
}
