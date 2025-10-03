import { NextRequest, NextResponse } from 'next/server';
import { ValidationService } from '@/lib/services/validation.service';
import { NotificationService } from '@/lib/services/notification.service';
import { RealtimeService } from '@/lib/services/realtime.service';
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
    
    // Validate alert data
    const validation = ValidationService.validateAlert(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid alert data', details: validation.errors },
        { status: 400 }
      );
    }

    const alertData = validation.data;

    // Save alert to database
    // This would typically save to MongoDB
    console.log('Creating price alert:', alertData);

    // Send confirmation notification
    await NotificationService.sendNotification({
      type: 'email',
      to: session.user.email || '',
      subject: 'Price Alert Created',
      message: `Price alert for ${alertData.symbol} has been created successfully.`,
      metadata: {
        template: 'profileUpdate',
        symbol: alertData.symbol,
        alertType: alertData.alertType,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Alert created successfully',
      data: alertData,
    });
  } catch (error) {
    console.error('Create alert error:', error);
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

    // Get user's alerts from database
    // This would typically fetch from MongoDB
    const alerts = [
      {
        id: '1',
        symbol: 'AAPL',
        targetPrice: 150,
        alertType: 'price_above',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: '2',
        symbol: 'GOOGL',
        targetPrice: 2800,
        alertType: 'price_below',
        isActive: false,
        createdAt: new Date(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
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

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID required' },
        { status: 400 }
      );
    }

    // Update alert in database
    // This would typically update MongoDB
    console.log('Updating alert:', id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Alert updated successfully',
    });
  } catch (error) {
    console.error('Update alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID required' },
        { status: 400 }
      );
    }

    // Delete alert from database
    // This would typically delete from MongoDB
    console.log('Deleting alert:', id);

    return NextResponse.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
