<div align="center">
  <br />
    <a href="https://justtrade.app" target="_blank">
      <img src="public/assets/icons/logo.svg" alt="JustTrade Logo" width="200" height="80">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=next.js&color=black"/>
    <img src="https://img.shields.io/badge/-Better Auth-black?style=for-the-badge&logoColor=white&logo=betterauth&color=black"/>
    <img src="https://img.shields.io/badge/-Shadcn-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=black"/>
    <img src="https://img.shields.io/badge/-Inngest-black?style=for-the-badge&logoColor=white&logo=inngest&color=black"/><br/>

    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=00A35C"/>
    <img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=38B2AC"/>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6"/>
    <img src="https://img.shields.io/badge/-Framer Motion-black?style=for-the-badge&logoColor=white&logo=framer&color=0055FF"/>
  </div>

  <h3 align="center">JustTrade — Professional Trading Platform</h3>

   <div align="center">
     A comprehensive, real-time stock market analysis and trading platform built with modern web technologies.
    </div>
</div>

## 📋 Table of Contents

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🚀 [Quick Start](#quick-start)
5. 📱 [Screenshots](#screenshots)
6. 🔧 [Configuration](#configuration)
7. 📞 [Contact](#contact)

## ✨ Introduction

JustTrade is a professional-grade stock market analysis and trading platform that provides real-time market data, advanced charting capabilities, personalized watchlists, and AI-powered insights. Built with Next.js 15, it offers a modern, responsive interface for both novice and professional traders.

### Key Highlights:
- **Real-time Market Data**: Live stock prices, market indices, and sector performance
- **Advanced Charting**: Interactive TradingView widgets and custom chart components
- **AI-Powered Insights**: Personalized market summaries and trading recommendations
- **Professional UI/UX**: Modern, responsive design optimized for trading workflows
- **Comprehensive Analytics**: Technical analysis, financial data, and market sentiment

## ⚙️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/docs)** - React framework with App Router and Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/docs)** - Accessible, customizable React components
- **[Framer Motion](https://www.framer.com/motion/)** - Animation and gesture library
- **[Recharts](https://recharts.org/)** - Composable charting library

### Backend & Database
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication and authorization
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database with Mongoose ODM
- **[Inngest](https://inngest.com/)** - Event-driven workflows and background jobs
- **[Node.js](https://nodejs.org/)** - Server-side JavaScript runtime

### APIs & Services
- **[Finnhub](https://finnhub.io/)** - Real-time financial data API
- **[Google Gemini](https://aistudio.google.com/)** - AI-powered content generation
- **[Nodemailer](https://nodemailer.com/)** - Email notification system
- **[AWS SES](https://aws.amazon.com/ses/)** - Scalable email delivery
- **[Twilio](https://www.twilio.com/)** - SMS notifications

### Development Tools
- **[Turbopack](https://turbo.build/pack)** - Next.js optimized bundler
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Socket.IO](https://socket.io/)** - Real-time communication

## 🔋 Features

### 📊 **Market Overview**
- Real-time market indices (S&P 500, NASDAQ, DOW)
- Interactive sector performance heatmaps
- Custom chart components with multiple timeframes
- Market sentiment analysis and trends

### 🔍 **Advanced Search & Discovery**
- Intelligent stock search with autocomplete
- Filter by industry, market cap, and performance
- Company logo integration via Clearbit API
- Real-time price updates and alerts

### 📈 **Professional Charting**
- TradingView widget integration
- Custom chart components with Recharts
- Multiple chart types (candlestick, line, area)
- Technical indicators and overlays

### 👤 **User Management**
- Secure authentication with Better Auth
- User profiles with trading preferences
- Personalized watchlists and alerts
- Account settings and notifications

### 🤖 **AI-Powered Features**
- Personalized market summaries
- AI-generated trading insights
- Sentiment analysis of news and social media
- Automated alert recommendations

### 📱 **Responsive Design**
- Mobile-first responsive layout
- Professional trading platform aesthetics
- Dark theme optimized for extended use
- Intuitive navigation with sidebar menu

### 🔔 **Real-time Notifications**
- Email alerts for price changes
- SMS notifications for critical updates
- Push notifications for market events
- Customizable alert preferences

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- [Git](https://git-scm.com/)
- [Node.js 18+](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/justtrade.git
cd justtrade
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your environment variables**
```env
# Application
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# APIs
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
GEMINI_API_KEY=your_gemini_api_key

# Email
NODEMAILER_EMAIL=your_email
NODEMAILER_PASSWORD=your_app_password

# AWS (Optional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

5. **Run the development server**
```bash
npm run dev
```

6. **Start Inngest (for background jobs)**
```bash
npx inngest-cli@latest dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Screenshots

### Dashboard
- Real-time market overview with live data
- Interactive charts and market indices
- Personalized watchlist and alerts

### Market Analysis
- Advanced charting tools
- Technical analysis indicators
- Sector performance heatmaps

### User Profile
- Trading preferences and settings
- Notification management
- Account security options

## 🔧 Configuration

### Database Setup
1. Create a MongoDB Atlas account
2. Set up a new cluster
3. Get your connection string
4. Add it to your `.env.local` file

### API Keys Setup
1. **Finnhub**: Get your API key from [finnhub.io](https://finnhub.io)
2. **Google Gemini**: Get your API key from [Google AI Studio](https://aistudio.google.com/)
3. **Better Auth**: Generate a secure secret key
4. **Email**: Set up SMTP credentials or use AWS SES

### Deployment
The application is optimized for deployment on Vercel, Netlify, or any Node.js hosting platform.

```bash
npm run build
npm start
```

## 📞 Contact

**Developer**: Sjestonsingh Singh  
**Email**: [sjestonsingh@gmail.com](mailto:sjestonsingh@gmail.com)  
**Project**: [JustTrade](https://justtrade.app)

---

<div align="center">
  <p>Built with ❤️ by Sjestonsingh Singh</p>
  <p>© 2025 JustTrade. All rights reserved.</p>
</div>