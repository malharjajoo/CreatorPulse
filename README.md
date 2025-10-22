# CreatorPulse Backend

AI-powered newsletter curation and drafting tool backend API.

## 🚀 Features

- **User Authentication** - Supabase Auth integration
- **Content Sources** - Twitter, YouTube, RSS feed integration
- **AI-Powered Analysis** - Groq LLM for trend analysis and content generation
- **Newsletter Generation** - Automated newsletter creation with writing style matching
- **Email Delivery** - Resend integration for newsletter delivery
- **Automated Scheduling** - Cron jobs for content fetching and delivery
- **Feedback System** - User feedback collection and analysis

## 🛠 Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Groq Cloud (Llama3-70B)
- **Email**: Resend
- **Scheduling**: node-cron

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Groq API key
- Resend API key
- Twitter API access (optional)
- YouTube API key (optional)

## ⚙️ Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # AI Configuration
   GROQ_API_KEY=your_groq_api_key
   
   # Email Configuration
   RESEND_API_KEY=your_resend_api_key
   
   # Social Media APIs (optional)
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token
   YOUTUBE_API_KEY=your_youtube_api_key
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Database Setup:**
   ```bash
   # Run database migration
   npm run db:migrate
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

### Sources
- `GET /api/sources` - Get user's sources
- `POST /api/sources` - Add new source
- `PUT /api/sources/:id` - Update source
- `DELETE /api/sources/:id` - Delete source

### Newsletters
- `GET /api/newsletters` - Get user's newsletters
- `GET /api/newsletters/:id` - Get specific newsletter
- `POST /api/newsletters/generate` - Generate new newsletter
- `PUT /api/newsletters/:id` - Update newsletter
- `DELETE /api/newsletters/:id` - Delete newsletter

### Trends
- `GET /api/trends` - Get user's trends
- `GET /api/trends/latest` - Get latest trends
- `POST /api/trends/fetch` - Fetch new trends

### Feedback
- `GET /api/feedback/newsletter/:newsletterId` - Get feedback for newsletter
- `POST /api/feedback` - Submit feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

## 🤖 AI Integration

The backend uses Groq's Llama3-70B model for:
- **Trend Analysis** - Identifying trending topics from content
- **Content Summarization** - Creating concise summaries
- **Newsletter Generation** - Writing newsletters in user's style
- **Writing Style Analysis** - Learning from user's writing samples

## ⏰ Automated Tasks

Cron jobs are configured for:
- **Content Fetching** - Every 6 hours
- **Newsletter Delivery** - Daily at 8 AM UTC
- **Content Cleanup** - Weekly (keeps last 30 days)
- **Trends Cleanup** - Weekly (keeps last 7 days)

## 🔧 Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:migrate
npm run db:seed
npm run db:reset
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `GROQ_API_KEY` | Groq API key for AI | ✅ |
| `RESEND_API_KEY` | Resend API key for email | ✅ |
| `TWITTER_BEARER_TOKEN` | Twitter API bearer token | ❌ |
| `YOUTUBE_API_KEY` | YouTube API key | ❌ |
| `PORT` | Server port (default: 3001) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ |

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm start
   ```

## 📊 Database Schema

The application uses the following main tables:
- `users` - User profiles
- `sources` - Content sources (Twitter, YouTube, RSS)
- `writing_samples` - User's writing samples for style learning
- `trends` - AI-analyzed trends
- `newsletters` - Generated newsletters
- `feedback` - User feedback on newsletters
- `content_items` - Cached content from sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
