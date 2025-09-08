"use client";

import { useState, useEffect } from "react";
import { ProductAPI } from "@/lib/api";
import { Product } from "@/types/product";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import "react-confirm-alert/src/react-confirm-alert.css";
import { showAddProductModal } from "./AddProductModal";
import { Trash2, ShoppingCart, Plus } from "lucide-react";

// Helper function to determine badge type based on product data
function getBadgeInfo(product: Product): {
  badge?: string;
  badgeType?: "new" | "sale" | "eco";
} {
  // Check for "new" tag or featured status
  if (product.tags?.includes("new") || product.featured) {
    return { badge: "New", badgeType: "new" };
  }
  // Check for sale (original price higher than current price)
  if (product.originalPrice && product.originalPrice > product.price) {
    return { badge: "Sale", badgeType: "sale" };
  }
  // Check for eco-friendly products
  if (
    product.tags?.includes("eco-friendly") ||
    product.tags?.includes("organic") ||
    product.tags?.includes("sustainable")
  ) {
    return { badge: "Eco", badgeType: "eco" };
  }
  return {};
}

// Helper function to get unique categories from products
function getCategories(products: Product[]): string[] {
  const categories = new Set<string>();
  categories.add("All");
  products.forEach((product) => {
    categories.add(product.category);
  });
  return Array.from(categories);
}

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductAPI.getProducts();

        if (response.success && response.data) {
          setProducts(response.data);
          setCategories(getCategories(response.data));
        } else {
          setError(response.error || "Failed to fetch products");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add new product function
  const handleAddProduct = () => {
    showAddProductModal({
      onProductAdded: (newProduct: Product) => {
        // Add the new product to the local state
        setProducts((prevProducts) => [newProduct, ...prevProducts]);
        // Update categories if needed
        const updatedProducts = [newProduct, ...products];
        setCategories(getCategories(updatedProducts));
      },
    });
  };

  // Delete product function with confirmation
  const handleDeleteProduct = (product: Product) => {
    confirmAlert({
      title: "Delete Product",
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      buttons: [
        {
          label: "Cancel",
          onClick: () => {
            // Do nothing, just close the modal
          },
        },
        {
          label: "Delete",
          onClick: async () => {
            try {
              setDeletingProductId(product.id);
              const response = await ProductAPI.deleteProduct(product.id);

              if (response.success) {
                // Remove the product from the local state
                setProducts((prevProducts) =>
                  prevProducts.filter((p) => p.id !== product.id)
                );
                // Update categories if needed
                const updatedProducts = products.filter(
                  (p) => p.id !== product.id
                );
                setCategories(getCategories(updatedProducts));

                // Show success toast
                toast.success(
                  `"${product.name}" has been deleted successfully!`,
                  {
                    duration: 4000,
                    icon: "🗑️",
                  }
                );
              } else {
                setError(response.error || "Failed to delete product");
                toast.error(response.error || "Failed to delete product");
              }
            } catch (err) {
              const errorMessage =
                "An unexpected error occurred while deleting the product";
              setError(errorMessage);
              toast.error(errorMessage);
              console.error("Error deleting product:", err);
            } finally {
              setDeletingProductId(null);
            }
          },
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      willUnmount: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <a href="/" className="logo">
            Kitchen365
          </a>
          <nav className="nav">
            <a href="/" className="nav-link">
              Home
            </a>
            <a href="/products" className="nav-link">
              Products
            </a>
            <a href="/about" className="nav-link">
              About
            </a>
          </nav>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="/" className="mobile-nav-link">
              Home
            </a>
            <a href="/products" className="mobile-nav-link">
              Products
            </a>
            <a href="/about" className="mobile-nav-link">
              About
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <div className="search-controls">
              <div className="search-box">
                <div className="search-icon">🔍</div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="add-product-btn"
                onClick={handleAddProduct}
                title="Add New Product"
              >
                <Plus size={18} className="add-product-icon" />
                Add New Product
              </button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <section className="products-section">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">❌ {error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="no-products-container">
              <p className="no-products-message">
                {searchQuery || activeCategory !== "All"
                  ? "No products found matching your criteria."
                  : "No products available. Try seeding some sample data!"}
              </p>
              {!searchQuery && activeCategory === "All" && (
                <a href="/api-test" className="seed-link">
                  Go to API Test Page to Add Products
                </a>
              )}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const badgeInfo = getBadgeInfo(product);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const placeholder =
                            target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                      <div
                        className="product-image-placeholder"
                        style={{ display: "none" }}
                      >
                        {product.name}
                      </div>
                      {badgeInfo.badge && (
                        <div
                          className={`product-badge badge-${badgeInfo.badgeType}`}
                        >
                          {badgeInfo.badge}
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>

                      <div className="product-price-container">
                        <div className="product-price">
                          ${product.price.toFixed(2)}
                        </div>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <div className="product-original-price">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                      </div>

                      <div className="product-actions">
                        <button className="add-to-cart-btn">
                          <ShoppingCart size={16} className="cart-icon" />
                          Add to Cart
                        </button>
                        <button
                          className={`delete-btn ${
                            deletingProductId === product.id ? "deleting" : ""
                          }`}
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingProductId === product.id}
                          title="Delete Product"
                        >
                          {deletingProductId === product.id ? (
                            <span className="delete-spinner">⏳</span>
                          ) : (
                            <Trash2 size={16} className="delete-icon" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">
          © 2025 Kitchen365. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
