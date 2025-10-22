import Groq from 'groq-sdk';
import { config } from '../config/env';

const groq = new Groq({
  apiKey: config.groq.apiKey,
});

export interface WritingStyle {
  samples: string[];
  tone: string;
  structure: string;
}

export interface ContentItem {
  title: string;
  content: string;
  url: string;
  published_at: string;
  engagement_metrics?: any;
}

export interface Trend {
  title: string;
  summary: string;
  keywords: string[];
}

export const generateNewsletterContent = async (
  trends: Trend[],
  contentItems: ContentItem[],
  writingStyle: WritingStyle,
  userTimezone: string = 'UTC'
): Promise<string> => {
  try {
    const systemPrompt = `You are CreatorPulse, an AI writing assistant for newsletter creators.
Using the user's writing style (provided examples) and latest trends,
draft a newsletter that includes:
- a short intro paragraph (match tone)
- 3–5 curated content summaries (1-2 sentences each)
- a "Trends to Watch" section with top 3 trends.
Keep the tone consistent with the user's past writing.

User's writing style examples:
${writingStyle.samples.join('\n\n')}

Tone: ${writingStyle.tone}
Structure: ${writingStyle.structure}

Current date: ${new Date().toLocaleDateString('en-US', { 
  timeZone: userTimezone,
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}`;

    const contentSummaries = contentItems
      .slice(0, 5)
      .map(item => `- ${item.title}: ${item.content.substring(0, 200)}...`)
      .join('\n');

    const trendsSection = trends
      .slice(0, 3)
      .map(trend => `- ${trend.title}: ${trend.summary}`)
      .join('\n');

    const userPrompt = `Please create a newsletter with the following content:

TRENDS TO WATCH:
${trendsSection}

CURATED CONTENT:
${contentSummaries}

Please format this as a professional newsletter that matches the user's writing style.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate newsletter content';
  } catch (error) {
    console.error('Error generating newsletter content:', error);
    throw new Error('Failed to generate newsletter content');
  }
};

export const analyzeTrends = async (
  contentItems: ContentItem[]
): Promise<Trend[]> => {
  try {
    const contentText = contentItems
      .map(item => `${item.title} ${item.content}`)
      .join(' ');

    const systemPrompt = `You are a trend analysis AI. Analyze the provided content and identify the top 3-5 trending topics.
For each trend, provide:
- A clear, engaging title
- A 2-3 sentence summary
- 3-5 relevant keywords

Focus on topics that are gaining momentum, have high engagement, or represent emerging themes.`;

    const userPrompt = `Analyze this content for trends:

${contentText}

Please identify the top trends and format them as JSON:
[
  {
    "title": "Trend Title",
    "summary": "Brief description of the trend",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing trends JSON:', parseError);
      // Fallback: create basic trends from content
      return contentItems.slice(0, 3).map((item, index) => ({
        title: `Trend ${index + 1}: ${item.title.substring(0, 50)}`,
        summary: item.content.substring(0, 150) + '...',
        keywords: item.title.split(' ').slice(0, 3)
      }));
    }
  } catch (error) {
    console.error('Error analyzing trends:', error);
    throw new Error('Failed to analyze trends');
  }
};

export const extractWritingStyle = async (
  writingSamples: string[]
): Promise<WritingStyle> => {
  try {
    if (writingSamples.length === 0) {
      return {
        samples: [],
        tone: 'professional',
        structure: 'standard'
      };
    }

    const systemPrompt = `You are a writing style analyzer. Analyze the provided writing samples and extract:
1. The overall tone (e.g., professional, casual, conversational, formal)
2. The typical structure (e.g., bullet points, paragraphs, lists)
3. Key characteristics of the writing style

Provide a concise analysis.`;

    const userPrompt = `Analyze these writing samples:

${writingSamples.join('\n\n---\n\n')}

Please provide:
- Tone: [tone description]
- Structure: [structure description]
- Key characteristics: [brief list]`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Extract tone and structure from response
    const toneMatch = response.match(/Tone:\s*(.+)/i);
    const structureMatch = response.match(/Structure:\s*(.+)/i);
    
    return {
      samples: writingSamples,
      tone: toneMatch?.[1]?.trim() || 'professional',
      structure: structureMatch?.[1]?.trim() || 'standard'
    };
  } catch (error) {
    console.error('Error extracting writing style:', error);
    return {
      samples: writingSamples,
      tone: 'professional',
      structure: 'standard'
    };
  }
};
