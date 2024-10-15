// Button.jsx
import React from 'react';
import Modal from '../../Modal/Modal';

const Button = ({ children, variant = 'primary', icon, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold flex items-center justify-center transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};


const Card = ({ children, title, subtitle, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105" onClick={onClick}>
      <div className="p-4">
        {title && <h3 className="text-xl font-semibold mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};


const Input = ({ label, icon, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</span>}
        <input
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            icon ? 'pl-10' : ''
          }`}
          {...props}
        />
      </div>
    </div>
  );
};

const Tag = ({ children }) => {
  return (
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      {children}
    </span>
  );
};

const Select = ({ label, options, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
export { Button, Card, Input, Select, Tag,  ConfirmDialog };