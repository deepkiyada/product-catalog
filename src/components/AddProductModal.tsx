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
  price: string;
  category: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
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
    price: "",
    category: "Kitchen Tools", // Default category
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

    // Image validation is handled in handleFileChange

    // Validate price
    if (!formData.price.trim()) {
      errors.price = "Price is required";
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.price = "Price must be a positive number";
      }
    }

    // Validate category
    if (!formData.category.trim()) {
      errors.category = "Category is required";
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
      // Always use placeholder image with gradient
      const imageUrl = `/api/placeholder-image?text=${encodeURIComponent(
        formData.name.trim()
      )}&width=400&height=300`;

      const productData: Omit<Product, "id"> = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent space and backspace from closing the modal when used in input fields
    if (e.key === " " || e.key === "Backspace") {
      e.stopPropagation();
    }
  };

  return (
    <div className="add-product-modal" onKeyDown={handleKeyDown}>
      <h1>Add New Product</h1>
      <form
        className="add-product-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
          <label className="form-label" htmlFor="product-category">
            Category *
          </label>
          <select
            id="product-category"
            className="form-input"
            value={formData.category}
            onChange={(e) => updateFormData("category", e.target.value)}
            disabled={isSubmitting}
          >
            <option value="Kitchen Tools">Kitchen Tools</option>
            <option value="Appliances">Appliances</option>
          </select>
          {formErrors.category && (
            <div className="form-error">{formErrors.category}</div>
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
    keyCodeForClose: [], // Remove space and backspace from closing the modal
    willUnmount: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {},
  });
}
