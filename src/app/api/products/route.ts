import { NextRequest, NextResponse } from "next/server";
import { readProducts, addProduct, filterProducts } from "@/lib/fileStorage";
import { Product } from "@/types/product";

// GET /api/products - Get all products or filtered products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    // Build filters object
    const filters: any = {};

    if (category) filters.category = category;
    if (minPrice && maxPrice) {
      filters.priceRange = {
        min: parseFloat(minPrice),
        max: parseFloat(maxPrice),
      };
    }

    if (search) filters.search = search;

    // Get filtered products
    let products =
      Object.keys(filters).length > 0
        ? filterProducts(filters)
        : readProducts();

    // Filter for featured products if requested
    if (featured === "true") {
      products = products.filter((product) => product.featured === true);
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "price", "category", "image"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Set default values
    const productData: Omit<Product, "id"> = {
      name: body.name,
      price: body.price,
      originalPrice: body.originalPrice,
      category: body.category,
      image: body.image,
      images: body.images || [],
      featured: body.featured || false,
      tags: body.tags || [],
    };

    const newProduct = addProduct(productData);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
