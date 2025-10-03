import { NextRequest, NextResponse } from 'next/server';
import { ValidationService } from '@/lib/services/validation.service';
import { NotificationService } from '@/lib/services/notification.service';
import { auth } from '@/lib/better-auth/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's trading preferences from database
    // This would typically fetch from MongoDB
    const preferences = {
      riskTolerance: 'moderate',
      investmentGoals: ['growth', 'income'],
      preferredSectors: ['technology', 'healthcare', 'finance'],
      tradingStyle: 'swing_trading',
      positionSizing: 'medium',
      stopLossPercentage: 5,
      takeProfitPercentage: 15,
      maxDailyLoss: 10,
      maxDailyTrades: 5,
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
        priceAlerts: true,
        newsAlerts: true,
        volumeAlerts: false,
      },
    };

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate trading preferences
    const validation = ValidationService.validateTradingPreferences(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid preferences data', details: validation.errors },
        { status: 400 }
      );
    }

    const preferences = validation.data;

    // Update user preferences in database
    // This would typically update MongoDB
    console.log('Updating trading preferences:', preferences);

    // Send notification about preferences update
    await NotificationService.sendNotification({
      type: 'email',
      to: session.user.email || '',
      subject: 'Trading Preferences Updated',
      message: 'Your trading preferences have been updated successfully.',
      metadata: {
        template: 'profileUpdate',
        preferences: preferences,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: preferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'reset_preferences':
        // Reset to default preferences
        const defaultPreferences = {
          riskTolerance: 'moderate',
          investmentGoals: ['growth'],
          preferredSectors: ['technology'],
          tradingStyle: 'swing_trading',
          positionSizing: 'medium',
          stopLossPercentage: 5,
          takeProfitPercentage: 15,
          maxDailyLoss: 10,
          maxDailyTrades: 5,
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
            priceAlerts: true,
            newsAlerts: true,
            volumeAlerts: false,
          },
        };

        // Update database with default preferences
        console.log('Resetting to default preferences');

        return NextResponse.json({
          success: true,
          message: 'Preferences reset to default',
          data: defaultPreferences,
        });

      case 'export_preferences':
        // Export preferences as JSON
        const preferences = {
          // This would fetch from database
          riskTolerance: 'moderate',
          investmentGoals: ['growth', 'income'],
          preferredSectors: ['technology', 'healthcare'],
          tradingStyle: 'swing_trading',
          positionSizing: 'medium',
          stopLossPercentage: 5,
          takeProfitPercentage: 15,
          maxDailyLoss: 10,
          maxDailyTrades: 5,
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
            priceAlerts: true,
            newsAlerts: true,
            volumeAlerts: false,
          },
          exportedAt: new Date().toISOString(),
        };

        return NextResponse.json({
          success: true,
          data: preferences,
        });

      case 'import_preferences':
        // Import preferences from JSON
        const importData = data;
        
        // Validate imported data
        const validation = ValidationService.validateTradingPreferences(importData);
        if (!validation.success) {
          return NextResponse.json(
            { error: 'Invalid import data', details: validation.errors },
            { status: 400 }
          );
        }

        // Update database with imported preferences
        console.log('Importing preferences:', importData);

        return NextResponse.json({
          success: true,
          message: 'Preferences imported successfully',
          data: importData,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Preferences action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
