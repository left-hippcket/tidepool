import React from 'react';

export function FMRadioGroup({ value, onChange, options, className = '' }) {
  return (
    <div role="radiogroup" className={`grid w-full gap-2 grid-cols-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange?.(option.value)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer hover:bg-gray-50 ${
            value === option.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white'
          }`}
        >
          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            value === option.value ? 'border-blue-600' : 'border-gray-300'
          }`}>
            {value === option.value && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
          </span>
          <span className={value === option.value ? 'text-gray-900' : 'text-gray-600'}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
