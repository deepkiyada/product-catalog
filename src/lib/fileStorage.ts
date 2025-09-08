import { Product } from "@/types/product";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

// Ensure data directory exists
export function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read all products from file
export function readProducts(): Product[] {
  try {
    ensureDataDirectory();

    if (!fs.existsSync(PRODUCTS_FILE)) {
      // Create empty products file if it doesn't exist
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
      return [];
    }

    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

// Write products to file
export function writeProducts(products: Product[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error writing products:", error);
    throw new Error("Failed to save products");
  }
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Find product by ID
export function findProductById(id: string): Product | undefined {
  const products = readProducts();
  return products.find((product) => product.id === id);
}

// Add new product
export function addProduct(productData: Omit<Product, "id">): Product {
  const products = readProducts();
  const newProduct: Product = {
    ...productData,
    id: generateId(),
  };

  products.push(newProduct);
  writeProducts(products);
  return newProduct;
}

// Update existing product
export function updateProduct(
  id: string,
  productData: Partial<Omit<Product, "id">>
): Product | null {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  products[index] = { ...products[index], ...productData };
  writeProducts(products);
  return products[index];
}

// Delete product
export function deleteProduct(id: string): boolean {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);
  writeProducts(products);
  return true;
}

// Filter products
export function filterProducts(filters: {
  category?: string;
  priceRange?: { min: number; max: number };
  search?: string;
}): Product[] {
  let products = readProducts();

  if (filters.category) {
    products = products.filter(
      (product) =>
        product.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.priceRange) {
    products = products.filter(
      (product) =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.tags &&
          product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  }

  return products;
}
