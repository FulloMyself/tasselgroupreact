import React, { createContext, useState, useContext, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    content: null,
    size: 'md'
  });

  // Notification system
  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const notification = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Modal system
  const openModal = useCallback((title, content, size = 'md') => {
    setModal({
      isOpen: true,
      title,
      content,
      size
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({
      isOpen: false,
      title: '',
      content: null,
      size: 'md'
    });
  }, []);

  // Global loading state
  const setGlobalLoading = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  // Print functionality
  const printContent = useCallback((title, content) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .badge { padding: 5px 10px; border-radius: 10px; color: white; }
            .bg-primary { background: #007bff; }
            .bg-success { background: #28a745; }
            .bg-warning { background: #ffc107; color: black; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background: #f8f9fa; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, []);

  const value = {
    // Notifications
    notifications,
    showNotification,
    removeNotification,
    
    // Modal
    modal,
    openModal,
    closeModal,
    
    // Loading
    loading,
    setGlobalLoading,
    
    // Utilities
    printContent
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};