import { supabaseAdmin } from './supabase';
import fs from 'fs';
import path from 'path';

const createTables = async () => {
  console.log('🚀 Starting database migration...');

  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ Error creating tables:', error);
      return;
    }

    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Alternative migration using individual table creation
const createTablesIndividually = async () => {
  console.log('🚀 Creating database tables individually...');

  const tables = [
    {
      name: 'users',
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          timezone TEXT DEFAULT 'UTC',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'sources',
      sql: `
        CREATE TABLE IF NOT EXISTS public.sources (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          type TEXT NOT NULL CHECK (type IN ('twitter', 'youtube', 'rss')),
          handle TEXT NOT NULL,
          url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'writing_samples',
      sql: `
        CREATE TABLE IF NOT EXISTS public.writing_samples (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'trends',
      sql: `
        CREATE TABLE IF NOT EXISTS public.trends (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          keywords TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'newsletters',
      sql: `
        CREATE TABLE IF NOT EXISTS public.newsletters (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          sent_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'feedback',
      sql: `
        CREATE TABLE IF NOT EXISTS public.feedback (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          newsletter_id UUID REFERENCES public.newsletters(id) ON DELETE CASCADE,
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'content_items',
      sql: `
        CREATE TABLE IF NOT EXISTS public.content_items (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          url TEXT NOT NULL,
          published_at TIMESTAMP WITH TIME ZONE NOT NULL,
          engagement_metrics JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      console.log(`Creating table: ${table.name}`);
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: table.sql });
      
      if (error) {
        console.log(`Table ${table.name} might already exist or error:`, error.message);
      } else {
        console.log(`✅ Table ${table.name} created successfully`);
      }
    } catch (error) {
      console.log(`⚠️  Table ${table.name} creation skipped:`, error);
    }
  }

  console.log('✅ Database migration completed!');
};

// Run migration
createTablesIndividually().catch(console.error);
