import { Product, FilterOptions } from "@/types/product";

const API_BASE_URL = "/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export class ProductAPI {
  // Get all products with optional filters
  static async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
  }): Promise<ApiResponse<Product[]>> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice !== undefined)
          params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          params.append("maxPrice", filters.maxPrice.toString());

        if (filters.search) params.append("search", filters.search);
        if (filters.featured !== undefined)
          params.append("featured", filters.featured.toString());
      }

      const url = `${API_BASE_URL}/products${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      };
    }
  }

  // Get a single product by ID
  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching product:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      };
    }
  }

  // Create a new product
  static async createProduct(
    productData: Omit<Product, "id">
  ): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create product",
      };
    }
  }

  // Update an existing product
  static async updateProduct(
    id: string,
    productData: Partial<Omit<Product, "id">>
  ): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update product",
      };
    }
  }

  // Partially update a product
  static async patchProduct(
    id: string,
    productData: Partial<Omit<Product, "id">>
  ): Promise<ApiResponse<Product>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error patching product:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to patch product",
      };
    }
  }

  // Delete a product
  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      };
    }
  }

  // Seed database with sample products
  static async seedProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/seed`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error seeding products:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to seed products",
      };
    }
  }

  // Clear all products
  static async clearProducts(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/seed?force=true`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error clearing products:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to clear products",
      };
    }
  }
}
