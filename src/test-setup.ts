// Simple setup test script
import { config } from './config/env';
import { supabase } from './database/supabase';

const testSetup = async () => {
  console.log('🧪 Testing CreatorPulse Backend Setup...\n');

  // Test 1: Environment variables
  console.log('1. Testing environment variables...');
  try {
    console.log(`   ✅ Port: ${config.port}`);
    console.log(`   ✅ Supabase URL: ${config.supabase.url ? 'Set' : 'Missing'}`);
    console.log(`   ✅ Supabase Anon Key: ${config.supabase.anonKey ? 'Set' : 'Missing'}`);
    console.log(`   ✅ Groq API Key: ${config.groq.apiKey ? 'Set' : 'Missing'}`);
    console.log(`   ✅ Resend API Key: ${config.resend.apiKey ? 'Set' : 'Missing'}`);
  } catch (error) {
    console.log('   ❌ Environment configuration error:', error);
    return;
  }

  // Test 2: Supabase connection
  console.log('\n2. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('   ⚠️  Supabase connection test failed (tables may not exist yet):', error.message);
    } else {
      console.log('   ✅ Supabase connection successful');
    }
  } catch (error) {
    console.log('   ❌ Supabase connection error:', error);
  }

  // Test 3: AI Service (basic test)
  console.log('\n3. Testing AI service configuration...');
  try {
    const { generateNewsletterContent } = await import('./services/aiService');
    console.log('   ✅ AI service module loaded successfully');
  } catch (error) {
    console.log('   ❌ AI service error:', error);
  }

  // Test 4: Email Service (basic test)
  console.log('\n4. Testing email service configuration...');
  try {
    const { sendNewsletterEmail } = await import('./services/emailService');
    console.log('   ✅ Email service module loaded successfully');
  } catch (error) {
    console.log('   ❌ Email service error:', error);
  }

  console.log('\n🎉 Setup test completed!');
  console.log('\nNext steps:');
  console.log('1. Set up your Supabase project and run: npm run db:migrate');
  console.log('2. Configure your environment variables in .env');
  console.log('3. Start the development server: npm run dev');
};

testSetup().catch(console.error);
