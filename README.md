# CreatorPulse - AI-Powered Newsletter Tool

A complete full-stack application for AI-powered newsletter curation and drafting. Save time by aggregating your favorite sources, detecting trends, and auto-generating newsletter drafts in your personal writing style.

## 🎯 Project Overview

CreatorPulse helps creators and agencies save time by:
- **Aggregating content** from Twitter, YouTube, and RSS feeds
- **Detecting trends** using AI analysis
- **Auto-generating newsletters** in your personal writing style
- **Delivering daily** at 8:00 AM in your timezone
- **Learning from feedback** to improve over time

**Goal**: Cut newsletter creation time from hours to under 20 minutes.

## 🏗 Architecture

```
CreatorPulse/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── database/       # Supabase integration & migrations
│   │   ├── middleware/     # Auth & error handling
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # AI, email, content services
│   │   ├── cron/           # Automated tasks
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── frontend/               # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Groq Cloud (Llama3-70B)
- **Email**: Resend
- **Scheduling**: node-cron
- **Content Sources**: Twitter RSS, YouTube RSS, Custom RSS feeds

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State**: React Context + Custom Hooks
- **HTTP**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Groq API key
- Resend API key
- No Twitter/YouTube API keys needed (using RSS feeds)

### 1. Clone Repository
```bash
git clone <repository-url>
cd CreatorPulse
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure your .env file with API keys
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
# Configure your .env file
npm run dev
```

### 4. Database Setup
```bash
cd backend
npm run db:migrate
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📊 Features

### 🔐 Authentication
- Secure signup/login with Supabase Auth
- JWT token management
- Protected routes
- User profile management

### 📰 Newsletter Generation
- AI-powered content creation using Groq Llama3-70B
- Writing style learning from user samples
- Automated daily delivery at 8 AM
- Preview and edit capabilities
- Feedback collection system

### 📈 Content Sources
- **Twitter**: Follow handles and hashtags
- **YouTube**: Subscribe to channels
- **RSS**: Add custom RSS feeds
- Real-time content fetching
- Engagement metrics tracking

### 📊 Trends Analysis
- AI-powered trend detection
- Keyword extraction
- Topic clustering
- Visual trend indicators
- Historical trend data

### 📈 Analytics Dashboard
- Newsletter performance metrics
- Open and click rates
- User engagement tracking
- Trend analysis insights
- Export capabilities

### ⚙️ Settings & Configuration
- User profile management
- Timezone configuration
- Writing sample upload
- Source management
- AI model preferences

## 🔧 API Endpoints

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
- `POST /api/newsletters/generate` - Generate new newsletter
- `PUT /api/newsletters/:id` - Update newsletter
- `DELETE /api/newsletters/:id` - Delete newsletter

### Trends
- `GET /api/trends` - Get user's trends
- `POST /api/trends/fetch` - Fetch new trends

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/newsletter/:id` - Get feedback for newsletter

## 🤖 AI Integration

### Groq Llama3-70B Features
- **Content Summarization**: Condense articles and posts
- **Trend Analysis**: Identify trending topics and keywords
- **Newsletter Generation**: Create engaging newsletter content
- **Writing Style Learning**: Adapt to user's writing style
- **Tone Matching**: Maintain consistent voice across content

### AI Prompts
The system uses carefully crafted prompts for:
- Newsletter content generation
- Trend analysis and keyword extraction
- Writing style analysis
- Content summarization

## ⏰ Automated Tasks

### Cron Jobs
- **Content Fetching**: Every 6 hours
- **Newsletter Delivery**: Daily at 8 AM UTC
- **Content Cleanup**: Weekly (keeps last 30 days)
- **Trends Cleanup**: Weekly (keeps last 7 days)

### Email Delivery
- Automated newsletter sending via Resend
- HTML email templates
- Feedback collection buttons
- Delivery tracking

## 📱 User Interface

### Dashboard
- Overview of newsletters, trends, and analytics
- Quick actions for common tasks
- Real-time stats and metrics

### Source Management
- Visual source cards
- Add/edit/delete sources
- Real-time status indicators

### Newsletter Editor
- AI-generated content preview
- Edit and customize functionality
- Send/save options

### Trends Analysis
- Visual trend indicators
- Keyword clouds
- Historical trend data

### Analytics
- Performance metrics
- Engagement charts
- Export capabilities

## 🔒 Security

- JWT token authentication
- Row-level security (RLS) in Supabase
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Backend Deployment
1. Build: `npm run build`
2. Set environment variables
3. Deploy to your preferred platform (Vercel, Railway, etc.)

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist` folder to hosting service
3. Configure environment variables

### Database
- Supabase handles database hosting and scaling
- Automatic backups and security updates

## 📈 Performance

- **Frontend**: Vite for fast builds and HMR
- **Backend**: Express.js with optimized middleware
- **Database**: Supabase with connection pooling
- **Caching**: Content caching for improved performance
- **CDN**: Static assets served via CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

- [ ] Advanced AI model selection
- [ ] Custom newsletter templates
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Multi-language support

---

**CreatorPulse** - Transform your newsletter creation process with AI-powered automation! 🚀