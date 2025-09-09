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
  category: string;
}

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface FormErrors {
  name?: string;
  image?: string;
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
    image: "",
    price: "",
    category: "Kitchen Tools", // Default category
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );

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
      // Upload image if file is selected, otherwise use placeholder
      let imageUrl = `/api/placeholder-image?text=${encodeURIComponent(
        formData.name.trim()
      )}&width=400&height=300`;

      if (imageFile) {
        try {
          imageUrl = await uploadImage();
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setFormErrors({ image: "Failed to upload image. Please try again." });
          return;
        }
      }

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      setUploadedImage(null);
      setFormData((prev) => ({ ...prev, image: "" }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
      }));
      return;
    }

    // Validate file size (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setFormErrors((prev) => ({
        ...prev,
        image: "File size too large. Maximum size is 1MB.",
      }));
      return;
    }

    // Clear any previous errors
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      throw new Error("No image file selected");
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to upload image");
      }

      setUploadedImage(result.data);
      setUploadProgress(100);
      return result.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
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
          <label className="form-label" htmlFor="product-image">
            Product Image (optional)
          </label>
          <input
            id="product-image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="form-input"
            onChange={handleFileChange}
            disabled={isSubmitting || isUploading}
            style={{ padding: "8px" }}
          />
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-light)",
              marginTop: "4px",
            }}
          >
            Maximum file size: 1MB. Supported formats: JPEG, PNG, WebP, GIF
          </div>
          {formErrors.image && (
            <div className="form-error">{formErrors.image}</div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div
              className="image-preview-container"
              style={{ marginTop: "12px" }}
            >
              <div
                className="image-preview-label"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "var(--text-primary)",
                }}
              >
                Preview:
              </div>

              <div
                className="image-preview-success"
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "2px solid #10b981",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#10b981",
                      fontWeight: "500",
                    }}
                  >
                    ✅ Image ready for upload
                  </div>
                  {imageFile && (
                    <div
                      style={{ fontSize: "0.7rem", color: "var(--text-light)" }}
                    >
                      {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-light)",
                      marginBottom: "4px",
                    }}
                  >
                    Uploading... {uploadProgress}%
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "4px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: "100%",
                        backgroundColor: "#10b981",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
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
