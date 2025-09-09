import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Maximum number of images allowed
export const MAX_IMAGES = 30;

// Interface for image file information
interface ImageFileInfo {
  filename: string;
  fullPath: string;
  uploadTime: Date;
  size: number;
}

// Get the uploads directory path
function getUploadsDir(): string {
  return join(process.cwd(), 'public', 'uploads');
}

// Get all uploaded image files with their metadata
export async function getUploadedImages(): Promise<ImageFileInfo[]> {
  const uploadsDir = getUploadsDir();
  
  if (!existsSync(uploadsDir)) {
    return [];
  }

  try {
    const files = await readdir(uploadsDir);
    const imageFiles: ImageFileInfo[] = [];

    for (const filename of files) {
      // Only process image files that match our naming pattern
      if (filename.startsWith('product_') && /\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) {
        const fullPath = join(uploadsDir, filename);
        const stats = await stat(fullPath);
        
        imageFiles.push({
          filename,
          fullPath,
          uploadTime: stats.birthtime, // File creation time
          size: stats.size
        });
      }
    }

    // Sort by upload time (oldest first)
    return imageFiles.sort((a, b) => a.uploadTime.getTime() - b.uploadTime.getTime());
  } catch (error) {
    console.error('Error reading uploaded images:', error);
    return [];
  }
}

// Delete a specific image file
export async function deleteImage(filename: string): Promise<boolean> {
  try {
    const fullPath = join(getUploadsDir(), filename);
    await unlink(fullPath);
    console.log(`Deleted image: ${filename}`);
    return true;
  } catch (error) {
    console.error(`Error deleting image ${filename}:`, error);
    return false;
  }
}

// Clean up old images to maintain the limit
export async function cleanupOldImages(): Promise<{
  deleted: string[];
  remaining: number;
  totalSize: number;
}> {
  const images = await getUploadedImages();
  const deleted: string[] = [];
  
  if (images.length <= MAX_IMAGES) {
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    return {
      deleted: [],
      remaining: images.length,
      totalSize
    };
  }

  // Calculate how many images to delete
  const imagesToDelete = images.length - MAX_IMAGES;
  
  // Delete the oldest images
  for (let i = 0; i < imagesToDelete; i++) {
    const imageToDelete = images[i];
    const success = await deleteImage(imageToDelete.filename);
    if (success) {
      deleted.push(imageToDelete.filename);
    }
  }

  // Get updated image list and calculate total size
  const remainingImages = await getUploadedImages();
  const totalSize = remainingImages.reduce((sum, img) => sum + img.size, 0);

  return {
    deleted,
    remaining: remainingImages.length,
    totalSize
  };
}

// Check if we're at or near the image limit
export async function getImageStats(): Promise<{
  count: number;
  limit: number;
  canUpload: boolean;
  totalSize: number;
  oldestImage?: string;
  newestImage?: string;
}> {
  const images = await getUploadedImages();
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  
  return {
    count: images.length,
    limit: MAX_IMAGES,
    canUpload: images.length < MAX_IMAGES,
    totalSize,
    oldestImage: images.length > 0 ? images[0].filename : undefined,
    newestImage: images.length > 0 ? images[images.length - 1].filename : undefined
  };
}

// Cleanup images that are no longer referenced in the database
export async function cleanupUnusedImages(referencedImages: string[]): Promise<{
  deleted: string[];
  kept: string[];
}> {
  const allImages = await getUploadedImages();
  const deleted: string[] = [];
  const kept: string[] = [];

  for (const image of allImages) {
    const imagePath = `/uploads/${image.filename}`;
    
    if (!referencedImages.includes(imagePath)) {
      const success = await deleteImage(image.filename);
      if (success) {
        deleted.push(image.filename);
      } else {
        kept.push(image.filename);
      }
    } else {
      kept.push(image.filename);
    }
  }

  return { deleted, kept };
}
