import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

// AWS SES Configuration - only initialize if valid credentials are provided
const sesClient = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

// AWS SNS Configuration - only initialize if valid credentials are provided
const snsClient = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

// Twilio Configuration - only initialize if valid credentials are provided
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Nodemailer Configuration (backup email service) - only initialize if valid credentials are provided
const emailTransporter = process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })
  : null;

export interface NotificationData {
  to: string;
  subject: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class NotificationService {
  // Email Templates
  static getEmailTemplates() {
    return {
      profileUpdate: {
        subject: 'Profile Updated - JustTrade',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); padding: 20px; border-radius: 10px;">
              <h2 style="color: #fbbf24; margin: 0 0 20px 0;">Profile Updated Successfully</h2>
              <p style="color: #e5e7eb; margin: 0 0 15px 0;">Your JustTrade profile has been updated successfully.</p>
              <p style="color: #e5e7eb; margin: 0 0 15px 0;">If you didn't make this change, please contact our support team immediately.</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">JustTrade Team</p>
              </div>
            </div>
          </div>
        `,
        text: 'Your JustTrade profile has been updated successfully. If you didn\'t make this change, please contact our support team immediately.'
      },
      stockAlert: {
        subject: 'Stock Alert - {{symbol}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); padding: 20px; border-radius: 10px;">
              <h2 style="color: #fbbf24; margin: 0 0 20px 0;">Stock Alert: {{symbol}}</h2>
              <div style="background: #374151; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #e5e7eb; margin: 0 0 10px 0;"><strong>Current Price:</strong> ${{currentPrice}}</p>
                <p style="color: #e5e7eb; margin: 0 0 10px 0;"><strong>Change:</strong> {{change}} ({{changePercent}}%)</p>
                <p style="color: #e5e7eb; margin: 0 0 10px 0;"><strong>Alert Type:</strong> {{alertType}}</p>
              </div>
              <p style="color: #e5e7eb; margin: 0 0 15px 0;">This alert was triggered based on your notification preferences.</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">JustTrade Team</p>
              </div>
            </div>
          </div>
        `,
        text: 'Stock Alert: {{symbol}} - Current Price: ${{currentPrice}}, Change: {{change}} ({{changePercent}}%), Alert Type: {{alertType}}'
      },
      welcome: {
        subject: 'Welcome to JustTrade!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); padding: 20px; border-radius: 10px;">
              <h2 style="color: #fbbf24; margin: 0 0 20px 0;">Welcome to JustTrade!</h2>
              <p style="color: #e5e7eb; margin: 0 0 15px 0;">Thank you for joining JustTrade, your professional trading platform.</p>
              <p style="color: #e5e7eb; margin: 0 0 15px 0;">Complete your profile to get personalized stock recommendations and alerts.</p>
              <div style="margin: 20px 0;">
                <a href="{{profileUrl}}" style="background: #fbbf24; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Complete Profile</a>
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">JustTrade Team</p>
              </div>
            </div>
          </div>
        `,
        text: 'Welcome to JustTrade! Complete your profile to get personalized stock recommendations and alerts.'
      }
    };
  }

  // Send Email via AWS SES
  static async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      // Try AWS SES first if available
      if (sesClient) {
        const templates = this.getEmailTemplates();
        let template = templates.profileUpdate;
        
        // Select template based on type
        if (data.type === 'email' && data.metadata?.template) {
          template = templates[data.metadata.template as keyof typeof templates] || templates.profileUpdate;
        }

        // Replace template variables
        let html = template.html;
        let text = template.text;
        let subject = template.subject;

        if (data.metadata) {
          Object.entries(data.metadata).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, String(value));
            text = text.replace(regex, String(value));
            subject = subject.replace(regex, String(value));
          });
        }

        const command = new SendEmailCommand({
          Source: process.env.FROM_EMAIL || 'noreply@justtrade.app',
          Destination: {
            ToAddresses: [data.to],
          },
          Message: {
            Subject: {
              Data: subject,
              Charset: 'UTF-8',
            },
            Body: {
              Html: {
                Data: html,
                Charset: 'UTF-8',
              },
              Text: {
                Data: text,
                Charset: 'UTF-8',
              },
            },
          },
        });

        await sesClient.send(command);
        return true;
      }
      
      // Fallback to Nodemailer if available
      if (emailTransporter) {
        await emailTransporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@justtrade.app',
          to: data.to,
          subject: data.subject,
          html: data.message,
        });
        return true;
      }
      
      console.warn('No email service configured - email sending disabled');
      return false;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  // Send SMS via Twilio
  static async sendSMS(data: NotificationData): Promise<boolean> {
    try {
      if (!twilioClient) {
        console.warn('Twilio client not initialized - SMS sending disabled');
        return false;
      }

      await twilioClient.messages.create({
        body: data.message,
        from: process.env.TWILIO_PHONE_NUMBER || '',
        to: data.to,
      });
      return true;
    } catch (error) {
      console.error('Twilio SMS Error:', error);
      return false;
    }
  }

  // Send Push Notification via AWS SNS
  static async sendPushNotification(data: NotificationData): Promise<boolean> {
    try {
      if (!snsClient || !process.env.SNS_TOPIC_ARN) {
        console.warn('AWS SNS not configured - push notification sending disabled');
        return false;
      }

      const command = new PublishCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: JSON.stringify({
          default: data.message,
          GCM: JSON.stringify({
            notification: {
              title: 'JustTrade',
              body: data.message,
              icon: '/icon-192x192.png',
            },
          }),
          APNS: JSON.stringify({
            aps: {
              alert: {
                title: 'JustTrade',
                body: data.message,
              },
              badge: 1,
            },
          }),
        }),
        MessageStructure: 'json',
      });

      await snsClient.send(command);
      return true;
    } catch (error) {
      console.error('AWS SNS Error:', error);
      return false;
    }
  }

  // Main notification method
  static async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      switch (data.type) {
        case 'email':
          return await this.sendEmail(data);
        case 'sms':
          return await this.sendSMS(data);
        case 'push':
          return await this.sendPushNotification(data);
        default:
          console.error('Unknown notification type:', data.type);
          return false;
      }
    } catch (error) {
      console.error('Notification Service Error:', error);
      return false;
    }
  }

  // Bulk notification method
  static async sendBulkNotifications(notifications: NotificationData[]): Promise<{ success: number; failed: number }> {
    const results = await Promise.allSettled(
      notifications.map(notification => this.sendNotification(notification))
    );

    const success = results.filter(result => result.status === 'fulfilled' && result.value).length;
    const failed = results.length - success;

    return { success, failed };
  }
}
