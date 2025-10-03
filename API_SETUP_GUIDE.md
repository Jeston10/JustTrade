# JustTrade API Keys Setup Guide

This guide will walk you through setting up all the required API keys and services for your JustTrade stock market application.

## 📋 Required Services Overview

Your JustTrade app needs these services:
- **MongoDB** - Database for user data, watchlists, alerts
- **Finnhub** - Real-time stock market data API
- **Google Gemini** - AI for personalized email content
- **Better Auth** - Authentication system
- **Nodemailer** - Email notifications (Gmail SMTP)

---

## 🗄️ 1. MongoDB Atlas Setup (Database)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Click "Try Free" and create an account
3. Choose "Build a new app" → "I'm learning MongoDB"

### Step 2: Create a Cluster
1. Choose **FREE** tier (M0 Sandbox)
2. Select a cloud provider (AWS recommended)
3. Choose a region close to you
4. Name your cluster (e.g., "justtrade-cluster")
5. Click "Create Cluster"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username (e.g., "justtrade-user")
5. Generate a secure password (save it!)
6. Set privileges to "Read and write to any database"
7. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `justtrade`

**Example connection string:**
```
mongodb+srv://justtrade-user:your-password@justtrade-cluster.abc123.mongodb.net/justtrade?retryWrites=true&w=majority
```

---

## 📈 2. Finnhub API Setup (Stock Data)

### Step 1: Create Finnhub Account
1. Go to [Finnhub.io](https://finnhub.io/)
2. Click "Get Free API Key"
3. Sign up with email or GitHub
4. Verify your email

### Step 2: Get Your API Key
1. After login, go to your dashboard
2. Copy your API key from the dashboard
3. **Free tier includes:**
   - 60 API calls/minute
   - Real-time stock quotes
   - Company profiles
   - News data
   - Historical data

**Note:** Free tier is sufficient for development and small-scale usage.

---

## 🤖 3. Google Gemini API Setup (AI Features)

### Step 1: Create Google AI Studio Account
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Accept terms and conditions

### Step 2: Get API Key
1. Click "Get API Key" in the top right
2. Click "Create API Key"
3. Choose "Create API key in new project" (recommended)
4. Copy the generated API key
5. **Free tier includes:**
   - 15 requests per minute
   - 1 million tokens per day
   - Perfect for email personalization

---

## 🔐 4. Better Auth Secret Setup

### Generate a Secure Secret
You need a random 32+ character string for JWT signing.

**Option 1: Use Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Use Online Generator**
1. Go to [randomkeygen.com](https://randomkeygen.com/)
2. Copy a "Fort Knox Passwords" key
3. Use the first 32+ characters

**Option 3: Manual Generation**
Create a 32+ character random string with letters, numbers, and symbols.

---

## 📧 5. Nodemailer Setup (Email Notifications)

### Option 1: Gmail SMTP (Recommended for Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

#### Step 2: Generate App Password
1. In Google Account Security, go to "App passwords"
2. Select "Mail" and "Other (custom name)"
3. Enter "JustTrade App"
4. Copy the generated 16-character password

#### Step 3: Use Your Gmail Credentials
- **Email:** your-gmail@gmail.com
- **Password:** the 16-character app password (not your regular password)

### Option 2: Custom SMTP (For Production)
If you have your own domain and email service:
- **Email:** your-email@yourdomain.com
- **Password:** your email password
- **SMTP Host:** your email provider's SMTP server

---

## 🔧 6. Final .env.local Setup

Create a file named `.env.local` in your project root with:

```env
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# FINNHUB - Stock Market Data
FINNHUB_API_KEY=your_finnhub_api_key_here
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key_here
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# MONGODB - Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/justtrade?retryWrites=true&w=majority

# BETTER AUTH - Authentication
BETTER_AUTH_SECRET=your_32_character_random_secret_here
BETTER_AUTH_URL=http://localhost:3000

# GEMINI - AI Features
GEMINI_API_KEY=your_gemini_api_key_here

# NODEMAILER - Email Notifications
NODEMAILER_EMAIL=your-gmail@gmail.com
NODEMAILER_PASSWORD=your_16_character_app_password
```

---

## ✅ 7. Testing Your Setup

### Test Database Connection
```bash
npm run test:db
```

### Test the Application
```bash
# Terminal 1: Start the app
npm run dev

# Terminal 2: Start Inngest (for background jobs)
npx inngest-cli@latest dev
```

Then visit: http://localhost:3000

---

## 🚨 Important Security Notes

1. **Never commit .env.local to Git** - It's already in .gitignore
2. **Use different keys for development and production**
3. **Rotate API keys regularly**
4. **Monitor API usage to avoid exceeding limits**
5. **Use environment-specific URLs for production**

---

## 🆘 Troubleshooting

### Common Issues:

**MongoDB Connection Failed:**
- Check your connection string format
- Ensure IP address is whitelisted
- Verify username/password

**Finnhub API Errors:**
- Check API key is correct
- Verify you haven't exceeded rate limits
- Ensure you're using the right endpoint

**Email Not Sending:**
- Verify Gmail app password (not regular password)
- Check 2FA is enabled
- Try a different email service

**Build Errors:**
- Ensure all environment variables are set
- Check for typos in variable names
- Verify all services are accessible

---

## 📞 Support

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify all API keys are correctly formatted
3. Test each service individually
4. Check service status pages for outages

Your JustTrade app should now be fully functional with all required services configured!
