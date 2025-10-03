# JustTrade Profile Page Setup Guide

This guide will help you set up all the necessary services and configurations for the JustTrade profile page to function with real-time notifications, email, SMS, file uploads, and other advanced features.

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account
- AWS account (for SES and SNS)
- Twilio account (for SMS)
- Gmail account (for backup email)

## 🔧 Environment Variables Setup

Add these environment variables to your `.env.local` file:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# AWS Configuration (for email and push notifications)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
FROM_EMAIL=noreply@justtrade.app
SNS_TOPIC_ARN=your_sns_topic_arn

# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Gmail Configuration (backup email service)
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=public/uploads
```

## 🚀 Service Setup Instructions

### 1. AWS SES (Simple Email Service) Setup

**Purpose**: Send transactional emails (profile updates, alerts, notifications)

#### Steps:
1. **Create AWS Account** (if you don't have one)
   - Go to [AWS Console](https://console.aws.amazon.com)
   - Sign up for a new account

2. **Set up SES**
   - Navigate to Simple Email Service (SES)
   - Verify your domain or email address
   - Request production access (if needed for high volume)

3. **Create IAM User**
   - Go to IAM → Users → Create User
   - Attach policy: `AmazonSESFullAccess`
   - Create access keys and add to `.env.local`

4. **Verify Email Addresses**
   - In SES console, verify sender email addresses
   - Add `noreply@justtrade.app` as verified sender

#### Required AWS Permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

### 2. AWS SNS (Simple Notification Service) Setup

**Purpose**: Send push notifications to mobile devices

#### Steps:
1. **Create SNS Topic**
   - Go to SNS → Topics → Create Topic
   - Name: `justtrade-push-notifications`
   - Copy the Topic ARN to `.env.local`

2. **Create Platform Applications**
   - For iOS: Create Apple Push Notification service (APNs)
   - For Android: Create Firebase Cloud Messaging (FCM)

3. **Subscribe to Topic**
   - Add email subscriptions for testing
   - Add mobile device endpoints

#### Required AWS Permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish",
                "sns:CreateTopic",
                "sns:Subscribe"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. Twilio SMS Setup

**Purpose**: Send SMS notifications and alerts

#### Steps:
1. **Create Twilio Account**
   - Go to [Twilio Console](https://console.twilio.com)
   - Sign up for a new account

2. **Get Credentials**
   - Copy Account SID and Auth Token
   - Add to `.env.local`

3. **Purchase Phone Number**
   - Buy a phone number for sending SMS
   - Add to `.env.local` as `TWILIO_PHONE_NUMBER`

4. **Verify Phone Numbers** (for testing)
   - Add test phone numbers in Twilio Console
   - Verify them for testing

#### Twilio Pricing:
- Trial account: Free credits for testing
- Production: ~$0.0075 per SMS in US

### 4. Gmail App Password Setup

**Purpose**: Backup email service using Gmail SMTP

#### Steps:
1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA for your Gmail account

2. **Generate App Password**
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Use this password in `.env.local`

3. **Test Configuration**
   - Use Gmail SMTP settings
   - Port: 587, Security: TLS

### 5. MongoDB Atlas Setup

**Purpose**: Store user profiles, preferences, and notification settings

#### Steps:
1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster

2. **Create Database User**
   - Username: `justtrade-user`
   - Password: Generate strong password
   - Database User Privileges: Read and write to any database

3. **Whitelist IP Addresses**
   - Add `0.0.0.0/0` for development (not recommended for production)
   - Add your server IP for production

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string to `.env.local`

### 6. File Upload Setup

**Purpose**: Handle profile image uploads and document storage

#### Steps:
1. **Create Upload Directory**
   ```bash
   mkdir -p public/uploads
   chmod 755 public/uploads
   ```

2. **Configure File Permissions**
   - Ensure web server can write to upload directory
   - Set appropriate file permissions

3. **Set up Image Processing**
   - Sharp library is already installed
   - Configure image optimization settings

## 🔌 API Integration Setup

### 1. Create API Routes

Create these API routes for profile functionality:

```typescript
// app/api/profile/upload/route.ts
// app/api/profile/notifications/route.ts
// app/api/profile/alerts/route.ts
// app/api/profile/preferences/route.ts
```

### 2. WebSocket Setup

Add Socket.IO server configuration:

```typescript
// lib/socket.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export const initializeSocket = (server: HTTPServer) => {
  // Socket.IO configuration
};
```

### 3. Database Models

Create MongoDB schemas for:

```typescript
// models/UserProfile.ts
// models/NotificationSettings.ts
// models/PriceAlert.ts
// models/FileUpload.ts
```

## 📱 Mobile App Integration (Optional)

### 1. Push Notification Setup

For mobile app integration:

1. **iOS Setup**
   - Create Apple Developer account
   - Generate APNs certificates
   - Configure in AWS SNS

2. **Android Setup**
   - Create Firebase project
   - Generate FCM server key
   - Configure in AWS SNS

### 2. Web Push Notifications

For web browser notifications:

1. **Service Worker**
   - Create `public/sw.js`
   - Handle push notifications

2. **VAPID Keys**
   - Generate VAPID keys
   - Add to environment variables

## 🧪 Testing Setup

### 1. Unit Tests

```bash
npm install --save-dev jest @testing-library/react
```

### 2. Integration Tests

```bash
npm install --save-dev supertest
```

### 3. E2E Tests

```bash
npm install --save-dev playwright
```

## 🚀 Deployment Setup

### 1. Vercel Deployment

1. **Environment Variables**
   - Add all environment variables to Vercel dashboard
   - Set production URLs

2. **Build Configuration**
   - Ensure all services are properly configured
   - Test in preview environment

### 2. AWS Deployment

1. **EC2 Instance**
   - Launch EC2 instance
   - Install Node.js and PM2

2. **RDS Database**
   - Create RDS MongoDB instance
   - Configure security groups

3. **S3 Bucket**
   - Create S3 bucket for file uploads
   - Configure CORS and permissions

## 🔍 Monitoring and Logging

### 1. Error Tracking

```bash
npm install @sentry/nextjs
```

### 2. Analytics

```bash
npm install @vercel/analytics
```

### 3. Logging

```bash
npm install winston
```

## 📊 Usage Examples

### 1. Send Email Notification

```typescript
import { NotificationService } from '@/lib/services/notification.service';

await NotificationService.sendNotification({
  type: 'email',
  to: 'user@example.com',
  subject: 'Profile Updated',
  message: 'Your profile has been updated successfully',
  metadata: { template: 'profileUpdate' }
});
```

### 2. Send SMS Alert

```typescript
await NotificationService.sendNotification({
  type: 'sms',
  to: '+1234567890',
  subject: 'Stock Alert',
  message: 'AAPL has reached your target price of $150',
  metadata: { symbol: 'AAPL', price: 150 }
});
```

### 3. Upload Profile Image

```typescript
import { FileUploadService } from '@/lib/services/file-upload.service';

const result = await FileUploadService.uploadProfileImage(file, userId);
if (result.success) {
  console.log('Image uploaded:', result.url);
}
```

### 4. Real-time Updates

```typescript
import { RealtimeService } from '@/lib/services/realtime.service';

// Send stock update to all watchers
RealtimeService.sendStockUpdate('AAPL', {
  symbol: 'AAPL',
  price: 150.25,
  change: 2.50,
  changePercent: 1.69,
  volume: 1000000,
  high: 151.00,
  low: 148.50,
  open: 149.00,
  previousClose: 147.75
});
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Email not sending**
   - Check AWS SES verification status
   - Verify IAM permissions
   - Check spam folder

2. **SMS not working**
   - Verify Twilio credentials
   - Check phone number format
   - Ensure sufficient credits

3. **File upload failing**
   - Check directory permissions
   - Verify file size limits
   - Check MIME type validation

4. **Real-time updates not working**
   - Check Socket.IO configuration
   - Verify CORS settings
   - Check client connection

### Debug Commands:

```bash
# Test database connection
npm run test:db

# Test email service
npm run test:email

# Test SMS service
npm run test:sms

# Check file uploads
npm run test:upload
```

## 📞 Support

If you encounter any issues:

1. Check the logs in your terminal
2. Verify all environment variables are set
3. Test each service individually
4. Check AWS/Twilio console for errors
5. Review the troubleshooting section above

## 🔄 Next Steps

After completing the setup:

1. Test all functionality in development
2. Set up monitoring and logging
3. Configure production environment
4. Set up automated backups
5. Implement security best practices
6. Create user documentation

---

**Note**: This setup guide covers the essential services for the profile page functionality. Some services may require additional configuration based on your specific requirements and usage patterns.
