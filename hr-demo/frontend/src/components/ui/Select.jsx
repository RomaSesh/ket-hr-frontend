import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [], // [{ value, label }]
  error,
  required = false,
  placeholder = 'Выберите...',
  disabled = false,
  className = '',
  ...props
}) => {
  const selectClasses = `
    w-full px-4 py-2.5 rounded-xl border 
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}
    bg-white transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-opacity-20
    disabled:bg-gray-100 disabled:cursor-not-allowed
    appearance-none
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Кастомная стрелка */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;