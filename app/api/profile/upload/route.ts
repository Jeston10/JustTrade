import { NextRequest, NextResponse } from 'next/server';
import { FileUploadService } from '@/lib/services/file-upload.service';
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'profile';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = ValidationService.validateFileUpload(file, {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid file', details: validation.errors },
        { status: 400 }
      );
    }

    // Convert File to Express.Multer.File format
    const buffer = await file.arrayBuffer();
    const multerFile = {
      fieldname: 'file',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      size: file.size,
      destination: '',
      filename: '',
      path: '',
      buffer: Buffer.from(buffer),
    } as Express.Multer.File;

    // Upload file based on type
    let result;
    if (uploadType === 'profile') {
      result = await FileUploadService.uploadProfileImage(multerFile, session.user.id);
    } else {
      result = await FileUploadService.uploadDocument(multerFile, session.user.id, uploadType);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: 'Upload failed', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        filename: result.filename,
        url: result.url,
        size: result.size,
        mimeType: result.mimeType,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
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

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename required' },
        { status: 400 }
      );
    }

    const success = await FileUploadService.deleteFile(filename);

    if (!success) {
      return NextResponse.json(
        { error: 'File deletion failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
