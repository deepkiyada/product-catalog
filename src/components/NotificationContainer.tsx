"use client";

import { createContext, useContext, ReactNode } from "react";
import ErrorNotification, { useErrorNotifications, ErrorNotificationProps } from "./ErrorNotification";

interface NotificationContextType {
  addNotification: (props: ErrorNotificationProps) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showError: (message: string, options?: Partial<ErrorNotificationProps>) => string;
  showWarning: (message: string, options?: Partial<ErrorNotificationProps>) => string;
  showInfo: (message: string, options?: Partial<ErrorNotificationProps>) => string;
  showSuccess: (message: string, options?: Partial<ErrorNotificationProps>) => string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { notifications, addNotification, removeNotification, clearAll } = useErrorNotifications();

  const showError = (message: string, options: Partial<ErrorNotificationProps> = {}) => {
    return addNotification({
      type: "error",
      message,
      autoClose: false,
      ...options,
    });
  };

  const showWarning = (message: string, options: Partial<ErrorNotificationProps> = {}) => {
    return addNotification({
      type: "warning",
      message,
      autoClose: true,
      autoCloseDelay: 6000,
      ...options,
    });
  };

  const showInfo = (message: string, options: Partial<ErrorNotificationProps> = {}) => {
    return addNotification({
      type: "info",
      message,
      autoClose: true,
      autoCloseDelay: 5000,
      ...options,
    });
  };

  const showSuccess = (message: string, options: Partial<ErrorNotificationProps> = {}) => {
    return addNotification({
      type: "success",
      message,
      autoClose: true,
      autoCloseDelay: 4000,
      ...options,
    });
  };

  const contextValue: NotificationContextType = {
    addNotification,
    removeNotification,
    clearAll,
    showError,
    showWarning,
    showInfo,
    showSuccess,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Notification Container */}
      <div className="error-notifications-container">
        {notifications.map(({ id, props }) => (
          <ErrorNotification key={id} {...props} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

// Utility functions for quick notifications
export const createNotificationHelpers = () => {
  let notificationContext: NotificationContextType | null = null;

  const setContext = (context: NotificationContextType) => {
    notificationContext = context;
  };

  const showError = (message: string, options?: Partial<ErrorNotificationProps>) => {
    if (notificationContext) {
      return notificationContext.showError(message, options);
    }
    console.error("Notification context not available:", message);
    return "";
  };

  const showWarning = (message: string, options?: Partial<ErrorNotificationProps>) => {
    if (notificationContext) {
      return notificationContext.showWarning(message, options);
    }
    console.warn("Notification context not available:", message);
    return "";
  };

  const showInfo = (message: string, options?: Partial<ErrorNotificationProps>) => {
    if (notificationContext) {
      return notificationContext.showInfo(message, options);
    }
    console.info("Notification context not available:", message);
    return "";
  };

  const showSuccess = (message: string, options?: Partial<ErrorNotificationProps>) => {
    if (notificationContext) {
      return notificationContext.showSuccess(message, options);
    }
    console.log("Notification context not available:", message);
    return "";
  };

  return {
    setContext,
    showError,
    showWarning,
    showInfo,
    showSuccess,
  };
};

export const notificationHelpers = createNotificationHelpers();
