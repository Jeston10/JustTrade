import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/services/notification.service';
import { ValidationService } from '@/lib/services/validation.service';
import { auth } from '@/lib/better-auth/auth';

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
    
    // Validate notification data
    const validation = ValidationService.validateNotification(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: validation.errors },
        { status: 400 }
      );
    }

    const notificationData = validation.data;

    // Send notification
    const success = await NotificationService.sendNotification(notificationData);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get user's notification preferences
    // This would typically fetch from database
    const preferences = {
      email: true,
      sms: false,
      push: true,
      priceAlerts: true,
      newsAlerts: true,
      volumeAlerts: false,
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
    
    // Validate preferences
    const validation = ValidationService.validateAccountSettings(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid preferences data', details: validation.errors },
        { status: 400 }
      );
    }

    const preferences = validation.data;

    // Update user preferences in database
    // This would typically update the database
    console.log('Updating notification preferences:', preferences);

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
