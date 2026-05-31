import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const inputClasses = `
    w-full px-4 py-2.5 rounded-xl border 
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}
    bg-white transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-opacity-20
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;