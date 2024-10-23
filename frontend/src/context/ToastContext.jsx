// src/context/ToastContext.js
import React, { createContext, useState, useContext } from "react";
import Toast from "../view/components/UI/Toast";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type) => {
    setToasts((prevToasts) => [...prevToasts, { message, type }]);
  };

  const removeToast = (index) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="relative">
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(index)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
