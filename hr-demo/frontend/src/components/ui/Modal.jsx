import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
export default Modal;