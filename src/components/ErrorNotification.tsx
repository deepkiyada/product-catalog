"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

export type ErrorType = "error" | "warning" | "info" | "success";

export interface ErrorNotificationProps {
  type?: ErrorType;
  title?: string;
  message: string;
  details?: string;
  onClose?: () => void;
  onRetry?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showIcon?: boolean;
  className?: string;
}

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  error: {
    bg: "var(--error-bg)",
    border: "var(--error-border)",
    text: "var(--error-text)",
    icon: "var(--error-icon)",
  },
  warning: {
    bg: "var(--warning-bg)",
    border: "var(--warning-border)",
    text: "var(--warning-text)",
    icon: "var(--warning-icon)",
  },
  info: {
    bg: "var(--info-bg)",
    border: "var(--info-border)",
    text: "var(--info-text)",
    icon: "var(--info-icon)",
  },
  success: {
    bg: "var(--success-bg)",
    border: "var(--success-border)",
    text: "var(--success-text)",
    icon: "var(--success-icon)",
  },
};

export default function ErrorNotification({
  type = "error",
  title,
  message,
  details,
  onClose,
  onRetry,
  autoClose = false,
  autoCloseDelay = 5000,
  showIcon = true,
  className = "",
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const IconComponent = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    if (autoClose && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`error-notification ${type} ${
        isAnimating ? "closing" : ""
      } ${className}`}
      style={
        {
          "--notification-bg": colors.bg,
          "--notification-border": colors.border,
          "--notification-text": colors.text,
          "--notification-icon": colors.icon,
        } as React.CSSProperties
      }
    >
      <div className="error-notification-content">
        {showIcon && (
          <div className="error-notification-icon">
            <IconComponent size={20} />
          </div>
        )}

        <div className="error-notification-body">
          {title && <h4 className="error-notification-title">{title}</h4>}
          <p className="error-notification-message">{message}</p>
          {details && (
            <details className="error-notification-details">
              <summary>Show details</summary>
              <pre className="error-notification-details-content">
                {details}
              </pre>
            </details>
          )}
        </div>

        <div className="error-notification-actions">
          {onRetry && (
            <button
              className="error-notification-retry"
              onClick={onRetry}
              type="button"
            >
              Try Again
            </button>
          )}

          {onClose && (
            <button
              className="error-notification-close"
              onClick={handleClose}
              type="button"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for managing multiple notifications
export function useErrorNotifications() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      props: ErrorNotificationProps;
    }>
  >([]);

  const addNotification = (props: ErrorNotificationProps) => {
    const id = Math.random().toString(36).substring(2, 11);
    setNotifications((prev) => [
      ...prev,
      {
        id,
        props: {
          ...props,
          onClose: () => {
            removeNotification(id);
            props.onClose?.();
          },
        },
      },
    ]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}
