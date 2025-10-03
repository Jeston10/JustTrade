import { z } from 'zod';

// Profile validation schemas
export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  tradingExperience: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    required_error: 'Please select your trading experience level',
  }),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profileImage: z.string().url('Invalid profile image URL').optional(),
});

export const tradingPreferencesSchema = z.object({
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive'], {
    required_error: 'Please select your risk tolerance',
  }),
  investmentGoals: z.array(z.string()).min(1, 'Please select at least one investment goal'),
  preferredSectors: z.array(z.string()).min(1, 'Please select at least one preferred sector'),
  tradingStyle: z.enum(['day_trading', 'swing_trading', 'position_trading', 'scalping'], {
    required_error: 'Please select your trading style',
  }),
  positionSizing: z.enum(['small', 'medium', 'large'], {
    required_error: 'Please select your position sizing preference',
  }),
  stopLossPercentage: z.number().min(0).max(50, 'Stop loss percentage must be between 0 and 50'),
  takeProfitPercentage: z.number().min(0).max(1000, 'Take profit percentage must be between 0 and 1000'),
  maxDailyLoss: z.number().min(0).max(100, 'Max daily loss must be between 0 and 100'),
  maxDailyTrades: z.number().min(1).max(100, 'Max daily trades must be between 1 and 100'),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    priceAlerts: z.boolean(),
    newsAlerts: z.boolean(),
    volumeAlerts: z.boolean(),
  }),
});

export const stockMonitoringSchema = z.object({
  watchlist: z.array(z.string()).max(50, 'Maximum 50 stocks in watchlist'),
  priceAlerts: z.array(z.object({
    symbol: z.string().min(1, 'Symbol is required'),
    targetPrice: z.number().positive('Target price must be positive'),
    alertType: z.enum(['price_above', 'price_below', 'volume_spike']),
    isActive: z.boolean(),
  })).max(20, 'Maximum 20 price alerts'),
  volumeAlerts: z.array(z.object({
    symbol: z.string().min(1, 'Symbol is required'),
    volumeThreshold: z.number().positive('Volume threshold must be positive'),
    isActive: z.boolean(),
  })).max(10, 'Maximum 10 volume alerts'),
  newsAlerts: z.array(z.object({
    symbol: z.string().min(1, 'Symbol is required'),
    keywords: z.array(z.string()).max(5, 'Maximum 5 keywords per alert'),
    isActive: z.boolean(),
  })).max(10, 'Maximum 10 news alerts'),
});

export const accountSettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  dataRetention: z.enum(['30_days', '90_days', '1_year', 'forever']),
  privacyLevel: z.enum(['public', 'private', 'friends_only']),
  shareData: z.boolean(),
  marketingEmails: z.boolean(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number().positive(),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
  }),
  maxSize: z.number().optional(),
  allowedTypes: z.array(z.string()).optional(),
});

// Notification validation
export const notificationSchema = z.object({
  type: z.enum(['email', 'sms', 'push']),
  to: z.string().min(1, 'Recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  metadata: z.record(z.any()).optional(),
});

// Stock data validation
export const stockDataSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  price: z.number().positive('Price must be positive'),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number().positive('Volume must be positive'),
  high: z.number().positive('High must be positive'),
  low: z.number().positive('Low must be positive'),
  open: z.number().positive('Open must be positive'),
  previousClose: z.number().positive('Previous close must be positive'),
  timestamp: z.date(),
});

// Alert validation
export const alertSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  targetPrice: z.number().positive('Target price must be positive'),
  alertType: z.enum(['price_above', 'price_below', 'volume_spike', 'news_alert']),
  isActive: z.boolean(),
  userId: z.string().min(1, 'User ID is required'),
});

// Validation service class
export class ValidationService {
  // Validate profile form data
  static validateProfileForm(data: any) {
    try {
      return {
        success: true,
        data: profileFormSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Validation failed' }],
      };
    }
  }

  // Validate trading preferences
  static validateTradingPreferences(data: any) {
    try {
      return {
        success: true,
        data: tradingPreferencesSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Validation failed' }],
      };
    }
  }

  // Validate stock monitoring data
  static validateStockMonitoring(data: any) {
    try {
      return {
        success: true,
        data: stockMonitoringSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Validation failed' }],
      };
    }
  }

  // Validate account settings
  static validateAccountSettings(data: any) {
    try {
      return {
        success: true,
        data: accountSettingsSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Validation failed' }],
      };
    }
  }

  // Validate file upload
  static validateFileUpload(file: any, options: { maxSize?: number; allowedTypes?: string[] } = {}) {
    try {
      const validationData = {
        file,
        maxSize: options.maxSize,
        allowedTypes: options.allowedTypes,
      };

      const result = fileUploadSchema.parse(validationData);
      
      // Additional custom validations
      if (options.maxSize && file.size > options.maxSize) {
        return {
          success: false,
          data: null,
          errors: [{ field: 'file', message: `File size exceeds maximum allowed size of ${options.maxSize} bytes` }],
        };
      }

      if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
        return {
          success: false,
          data: null,
          errors: [{ field: 'file', message: `File type ${file.mimetype} is not allowed` }],
        };
      }

      return {
        success: true,
        data: result,
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'File validation failed' }],
      };
    }
  }

  // Validate notification data
  static validateNotification(data: any) {
    try {
      return {
        success: true,
        data: notificationSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Notification validation failed' }],
      };
    }
  }

  // Validate stock data
  static validateStockData(data: any) {
    try {
      return {
        success: true,
        data: stockDataSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Stock data validation failed' }],
      };
    }
  }

  // Validate alert data
  static validateAlert(data: any) {
    try {
      return {
        success: true,
        data: alertSchema.parse(data),
        errors: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Alert validation failed' }],
      };
    }
  }

  // Sanitize string input
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .substring(0, 1000); // Limit length
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number format
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Validate URL format
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
