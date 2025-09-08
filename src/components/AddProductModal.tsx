"use client";

import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { ProductAPI } from "@/lib/api";
import { Product } from "@/types/product";
import toast from "react-hot-toast";

interface AddProductModalProps {
  onProductAdded: (product: Product) => void;
}

interface FormData {
  name: string;
  image: string;
  price: string;
}

interface FormErrors {
  name?: string;
  image?: string;
  price?: string;
}

function AddProductModalContent({
  onClose,
  onProductAdded,
}: {
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: "",
    price: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validate product name
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters";
    }

    // Validate image URL (optional)
    if (formData.image.trim()) {
      // Basic URL validation only if image URL is provided
      try {
        new URL(formData.image);
      } catch {
        errors.image = "Please enter a valid URL";
      }
    }

    // Validate price
    if (!formData.price.trim()) {
      errors.price = "Price is required";
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.price = "Price must be a positive number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use placeholder image with product name if no image URL provided
      const imageUrl =
        formData.image.trim() ||
        `/api/placeholder-image?text=${encodeURIComponent(
          formData.name.trim()
        )}&width=400&height=300`;

      const productData: Omit<Product, "id"> = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: "Kitchen Tools", // Default category
        image: imageUrl,
        featured: false,
        tags: [],
      };

      const response = await ProductAPI.createProduct(productData);

      if (response.success && response.data) {
        onProductAdded(response.data);
        toast.success(`"${productData.name}" has been added successfully!`, {
          duration: 4000,
          icon: "✅",
        });
        onClose(); // Close modal on success
        return;
      } else {
        toast.error(response.error || "Failed to create product");
        setFormErrors({ name: response.error || "Failed to create product" });
      }
    } catch (error) {
      const errorMessage =
        "An unexpected error occurred while creating the product";
      toast.error(errorMessage);
      setFormErrors({ name: errorMessage });
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="add-product-modal">
      <h1>Add New Product</h1>
      <form
        className="add-product-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="product-image">
            Image URL (optional)
          </label>
          <input
            id="product-image"
            type="url"
            className="form-input"
            placeholder="https://example.com/image.jpg (leave empty for random gradient)"
            value={formData.image}
            onChange={(e) => updateFormData("image", e.target.value)}
            disabled={isSubmitting}
          />
          {formErrors.image && (
            <div className="form-error">{formErrors.image}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="product-name">
            Product Name *
          </label>
          <input
            id="product-name"
            type="text"
            className="form-input"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            disabled={isSubmitting}
          />
          {formErrors.name && (
            <div className="form-error">{formErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="product-price">
            Price ($) *
          </label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            className="form-input"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => updateFormData("price", e.target.value)}
            disabled={isSubmitting}
          />
          {formErrors.price && (
            <div className="form-error">{formErrors.price}</div>
          )}
        </div>

        <div className="modal-buttons">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="modal-btn modal-btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="modal-loading">
                <div className="modal-spinner"></div>
                Saving...
              </div>
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function showAddProductModal({ onProductAdded }: AddProductModalProps) {
  confirmAlert({
    customUI: ({ onClose }) => (
      <AddProductModalContent
        onClose={onClose}
        onProductAdded={onProductAdded}
      />
    ),
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {},
  });
}
