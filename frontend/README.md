# CreatorPulse Frontend

Modern React frontend for the CreatorPulse AI-powered newsletter curation and drafting tool.

## 🚀 Features

- **Modern UI** - Built with React 18, TypeScript, and TailwindCSS
- **Authentication** - Secure login/signup with Supabase Auth
- **Dashboard** - Overview of newsletters, trends, and analytics
- **Source Management** - Add and manage content sources (Twitter, YouTube, RSS)
- **Newsletter Generation** - AI-powered newsletter creation and editing
- **Trends Analysis** - View AI-analyzed trending topics
- **Analytics** - Performance metrics and engagement tracking
- **Settings** - User preferences and writing style configuration

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Custom Components
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+
- Backend API running on port 3001

## ⚙️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp env.example .env
   ```
   
   Configure your environment variables:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_APP_NAME=CreatorPulse
   VITE_APP_VERSION=1.0.0
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   └── useApi.ts       # API data fetching hooks
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Sources.tsx     # Content sources management
│   ├── Newsletters.tsx # Newsletter management
│   ├── Trends.tsx      # Trends analysis
│   ├── Settings.tsx    # User settings
│   └── Analytics.tsx   # Analytics dashboard
├── services/           # API services
│   └── api.ts          # API client
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utility
│   └── format.ts       # Formatting utilities
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 UI Components

The app uses a custom component system built on TailwindCSS:

- **Buttons**: `btn`, `btn-primary`, `btn-secondary`, `btn-danger`
- **Cards**: `card`, `card-header`, `card-body`, `card-footer`
- **Forms**: `input`, `input-error`
- **Badges**: `badge`, `badge-primary`, `badge-success`, etc.
- **Utilities**: `spinner`, `focus-ring`, `text-gradient`

## 🔐 Authentication

The app uses Supabase Auth for authentication:

- **Login/Signup** - Email and password authentication
- **Protected Routes** - Automatic redirect to login for unauthenticated users
- **Token Management** - Automatic token refresh and storage
- **User Context** - Global user state management

## 📱 Responsive Design

The app is fully responsive and works on:

- **Desktop** - Full-featured dashboard experience
- **Tablet** - Optimized layout for medium screens
- **Mobile** - Mobile-first design with collapsible navigation

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `VITE_APP_NAME` | App name | `CreatorPulse` |
| `VITE_APP_VERSION` | App version | `1.0.0` |

### API Integration

The frontend communicates with the backend through:

- **REST API** - All CRUD operations
- **Authentication** - JWT token-based auth
- **Error Handling** - Global error handling with toast notifications
- **Loading States** - Loading indicators for all async operations

## 🎯 Key Features

### Dashboard
- Overview of newsletters, trends, and analytics
- Quick actions for common tasks
- Real-time stats and metrics

### Source Management
- Add Twitter, YouTube, and RSS sources
- Edit and delete sources
- Visual source cards with status indicators

### Newsletter Generation
- AI-powered newsletter creation
- Preview and edit generated content
- Send newsletters via email

### Trends Analysis
- AI-analyzed trending topics
- Keyword extraction and analysis
- Visual trend indicators

### Analytics
- Performance metrics
- Engagement tracking
- Visual charts and graphs

### Settings
- User profile management
- Writing sample upload
- Timezone configuration

## 🚀 Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** in your hosting platform

4. **Ensure backend API** is accessible from your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
