import multer from 'multer';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export interface UploadResult {
  success: boolean;
  filename?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
  url?: string;
  error?: string;
}

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maxSize?: number; // in bytes
}

export class FileUploadService {
  private static uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private static maxFileSize = 5 * 1024 * 1024; // 5MB
  private static allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  // Initialize upload directory
  static async initializeUploadDir(): Promise<void> {
    try {
      // Skip directory creation during build time
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('Skipping upload directory initialization during build');
        return;
      }
      
      await fs.mkdir(this.uploadDir, { recursive: true });
      console.log('Upload directory initialized:', this.uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      // Don't throw error during build time
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('Continuing without upload directory during build');
        return;
      }
      throw error;
    }
  }

  // Configure multer
  static getMulterConfig() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (this.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: this.maxFileSize,
      },
    });
  }

  // Process and optimize image
  static async processImage(
    inputPath: string,
    outputPath: string,
    options: ImageProcessingOptions = {}
  ): Promise<UploadResult> {
    try {
      const {
        width = 400,
        height = 400,
        quality = 80,
        format = 'jpeg',
        maxSize = this.maxFileSize,
      } = options;

      // Get original image info
      const originalInfo = await sharp(inputPath).metadata();
      
      // Check if resizing is needed
      const needsResize = originalInfo.width! > width || originalInfo.height! > height;
      
      let pipeline = sharp(inputPath);

      if (needsResize) {
        pipeline = pipeline.resize(width, height, {
          fit: 'cover',
          position: 'center',
        });
      }

      // Convert and optimize
      pipeline = pipeline[format]({ quality });

      // Apply additional optimizations
      if (format === 'jpeg') {
        pipeline = pipeline.jpeg({
          quality,
          progressive: true,
          mozjpeg: true,
        });
      } else if (format === 'png') {
        pipeline = pipeline.png({
          quality,
          progressive: true,
          compressionLevel: 9,
        });
      } else if (format === 'webp') {
        pipeline = pipeline.webp({
          quality,
          effort: 6,
        });
      }

      await pipeline.toFile(outputPath);

      // Check final file size
      const stats = await fs.stat(outputPath);
      if (stats.size > maxSize) {
        await fs.unlink(outputPath);
        throw new Error(`Processed image is too large: ${stats.size} bytes`);
      }

      return {
        success: true,
        filename: path.basename(outputPath),
        size: stats.size,
        mimeType: `image/${format}`,
        url: `/uploads/${path.basename(outputPath)}`,
      };
    } catch (error) {
      console.error('Image processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Upload and process profile image
  static async uploadProfileImage(
    file: Express.Multer.File,
    userId: string
  ): Promise<UploadResult> {
    try {
      await this.initializeUploadDir();

      const inputPath = file.path;
      const outputFilename = `profile-${userId}-${Date.now()}.jpeg`;
      const outputPath = path.join(this.uploadDir, outputFilename);

      // Process image for profile (400x400, JPEG, 80% quality)
      const result = await this.processImage(inputPath, outputPath, {
        width: 400,
        height: 400,
        quality: 80,
        format: 'jpeg',
        maxSize: 2 * 1024 * 1024, // 2MB max for profile images
      });

      if (result.success) {
        // Clean up original file
        await fs.unlink(inputPath);
        
        // Delete old profile image if exists
        await this.deleteOldProfileImage(userId);
      }

      return result;
    } catch (error) {
      console.error('Profile image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Upload and process document
  static async uploadDocument(
    file: Express.Multer.File,
    userId: string,
    documentType: string
  ): Promise<UploadResult> {
    try {
      await this.initializeUploadDir();

      const inputPath = file.path;
      const outputFilename = `${documentType}-${userId}-${Date.now()}${path.extname(file.originalname)}`;
      const outputPath = path.join(this.uploadDir, outputFilename);

      // For documents, just move the file (no image processing)
      await fs.rename(inputPath, outputPath);

      const stats = await fs.stat(outputPath);

      return {
        success: true,
        filename: outputFilename,
        originalName: file.originalname,
        size: stats.size,
        mimeType: file.mimetype,
        url: `/uploads/${outputFilename}`,
      };
    } catch (error) {
      console.error('Document upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Delete old profile image
  static async deleteOldProfileImage(userId: string): Promise<void> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const profileFiles = files.filter(file => 
        file.startsWith(`profile-${userId}-`) && 
        (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png'))
      );

      for (const file of profileFiles) {
        await fs.unlink(path.join(this.uploadDir, file));
        console.log(`Deleted old profile image: ${file}`);
      }
    } catch (error) {
      console.error('Error deleting old profile image:', error);
    }
  }

  // Delete file
  static async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Get file info
  static async getFileInfo(filename: string): Promise<{
    exists: boolean;
    size?: number;
    mimeType?: string;
    url?: string;
  }> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      const stats = await fs.stat(filePath);
      
      return {
        exists: true,
        size: stats.size,
        url: `/uploads/${filename}`,
      };
    } catch (error) {
      return { exists: false };
    }
  }

  // Validate file
  static validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`,
      };
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Invalid file type. Only images are allowed.',
      };
    }

    return { valid: true };
  }

  // Get upload statistics
  static async getUploadStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    fileTypes: Record<string, number>;
  }> {
    try {
      const files = await fs.readdir(this.uploadDir);
      let totalSize = 0;
      const fileTypes: Record<string, number> = {};

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;

        const ext = path.extname(file).toLowerCase();
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      }

      return {
        totalFiles: files.length,
        totalSize,
        fileTypes,
      };
    } catch (error) {
      console.error('Error getting upload stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        fileTypes: {},
      };
    }
  }
}
