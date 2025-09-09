import { NextRequest, NextResponse } from "next/server";
import { 
  getImageStats, 
  cleanupOldImages, 
  cleanupUnusedImages,
  getUploadedImages 
} from "@/lib/imageManager";
import { readProducts } from "@/lib/database";

// GET /api/images - Get image statistics and list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      // Return detailed image statistics
      const stats = await getImageStats();
      const images = await getUploadedImages();
      
      return NextResponse.json({
        success: true,
        data: {
          ...stats,
          images: images.map(img => ({
            filename: img.filename,
            uploadTime: img.uploadTime,
            size: img.size,
            url: `/uploads/${img.filename}`
          }))
        }
      });
    }

    if (action === "list") {
      // Return list of all uploaded images
      const images = await getUploadedImages();
      
      return NextResponse.json({
        success: true,
        data: images.map(img => ({
          filename: img.filename,
          uploadTime: img.uploadTime,
          size: img.size,
          url: `/uploads/${img.filename}`
        }))
      });
    }

    // Default: return basic stats
    const stats = await getImageStats();
    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("Error in images API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get image information" },
      { status: 500 }
    );
  }
}

// POST /api/images - Perform image management actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "cleanup") {
      // Clean up old images to maintain limit
      const result = await cleanupOldImages();
      
      return NextResponse.json({
        success: true,
        data: result,
        message: `Cleaned up ${result.deleted.length} old images`
      });
    }

    if (action === "cleanup-unused") {
      // Clean up images not referenced in database
      const products = await readProducts();
      const referencedImages = products.map(p => p.image);
      
      const result = await cleanupUnusedImages(referencedImages);
      
      return NextResponse.json({
        success: true,
        data: result,
        message: `Cleaned up ${result.deleted.length} unused images`
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'cleanup' or 'cleanup-unused'" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Error in images management:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform image management action" },
      { status: 500 }
    );
  }
}
