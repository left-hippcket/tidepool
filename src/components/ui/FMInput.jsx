import React from 'react';

export function FMInput({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  isCurrency = false,
  ...props
}) {
  const handleChange = (e) => {
    if (isCurrency) {
      // 숫자만 허용
      const numValue = e.target.value.replace(/[^0-9]/g, '');
      onChange?.(numValue);
    } else {
      onChange?.(e.target.value);
    }
  };

  const displayValue = isCurrency && value
    ? parseInt(value).toLocaleString('ko-KR')
    : value;

  return (
    <div className="relative w-full">
      <input
        type={isCurrency ? 'text' : type}
        value={displayValue || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
        {...props}
      />
      {isCurrency && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          원
        </span>
      )}
    </div>
  );
}
