import cron from 'node-cron';
import { fetchAllUserContent } from '../services/contentService';
import { fetchTrends } from '../services/trendService';
import { generateNewsletter, sendNewsletter } from '../services/newsletterService';
import { sendWelcomeEmail } from '../services/emailService';
import { supabase } from '../database/supabase';

// Fetch content and trends for all users every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Starting scheduled content and trends fetch...');
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log('No users found for content fetch');
      return;
    }

    console.log(`Processing ${users.length} users...`);

    for (const user of users) {
      try {
        console.log(`Processing user: ${user.email}`);
        
        // Fetch content from all sources
        await fetchAllUserContent(user.id);
        
        // Fetch trends
        await fetchTrends(user.id);
        
        console.log(`✅ Completed processing for user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Error processing user ${user.email}:`, error);
        // Continue with other users even if one fails
      }
    }

    console.log('✅ Scheduled content and trends fetch completed');
  } catch (error) {
    console.error('❌ Error in scheduled content fetch:', error);
  }
});

// Generate and send newsletters daily at 8 AM (UTC)
cron.schedule('0 8 * * *', async () => {
  console.log('📧 Starting scheduled newsletter generation and delivery...');
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, timezone');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    if (!users || users.length === 0) {
      console.log('No users found for newsletter delivery');
      return;
    }

    console.log(`Processing ${users.length} users for newsletter delivery...`);

    for (const user of users) {
      try {
        console.log(`Generating newsletter for user: ${user.email}`);
        
        // Generate newsletter
        const newsletter = await generateNewsletter(user.id);
        
        if (newsletter) {
          // Send newsletter
          const sent = await sendNewsletter(newsletter.id);
          
          if (sent) {
            console.log(`✅ Newsletter sent to: ${user.email}`);
          } else {
            console.log(`❌ Failed to send newsletter to: ${user.email}`);
          }
        } else {
          console.log(`❌ Failed to generate newsletter for: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error processing newsletter for user ${user.email}:`, error);
        // Continue with other users even if one fails
      }
    }

    console.log('✅ Scheduled newsletter delivery completed');
  } catch (error) {
    console.error('❌ Error in scheduled newsletter delivery:', error);
  }
});

// Clean up old content items (keep last 30 days)
cron.schedule('0 2 * * 0', async () => {
  console.log('🧹 Starting cleanup of old content items...');
  
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await supabase
      .from('content_items')
      .delete()
      .lt('published_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Error cleaning up old content:', error);
    } else {
      console.log('✅ Old content items cleaned up');
    }
  } catch (error) {
    console.error('❌ Error in content cleanup:', error);
  }
});

// Clean up old trends (keep last 7 days)
cron.schedule('0 3 * * 0', async () => {
  console.log('🧹 Starting cleanup of old trends...');
  
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error } = await supabase
      .from('trends')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString());

    if (error) {
      console.error('Error cleaning up old trends:', error);
    } else {
      console.log('✅ Old trends cleaned up');
    }
  } catch (error) {
    console.error('❌ Error in trends cleanup:', error);
  }
});

export const setupCronJobs = () => {
  console.log('⏰ Cron jobs initialized:');
  console.log('  - Content & trends fetch: Every 6 hours');
  console.log('  - Newsletter delivery: Daily at 8 AM UTC');
  console.log('  - Content cleanup: Weekly on Sunday at 2 AM UTC');
  console.log('  - Trends cleanup: Weekly on Sunday at 3 AM UTC');
};
