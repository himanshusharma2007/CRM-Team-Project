// src/components/Toast.js
import React, { useEffect, useState } from "react";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Delay calling onClose to allow exit animation
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg transition-all duration-300 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } ${getToastStyles()}`}
    >
      {message}
      <button className="ml-4" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
