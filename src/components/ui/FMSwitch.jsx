import React from 'react';

export function FMSwitch({
  checked = false,
  onChange,
  onLabel,
  offLabel,
  label,
  disabled = false,
  size = 'default', // 'default' | 'small'
  className = ""
}) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const sizeClasses = size === 'small'
    ? 'h-5 w-9'  // small: h-5 w-9
    : 'h-6 w-11'; // default: h-6 w-11

  const thumbSizeClasses = size === 'small'
    ? 'h-4 w-4'  // small thumb: h-4 w-4
    : 'h-5 w-5'; // default thumb: h-5 w-5

  const thumbTranslateClasses = size === 'small'
    ? checked ? 'translate-x-4' : 'translate-x-0.5'
    : checked ? 'translate-x-5' : 'translate-x-1';

  const textSizeClass = size === 'small' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      {label && (
        <span className="block text-sm text-gray-600 text-left font-medium">{label}</span>
      )}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={handleToggle}
          disabled={disabled}
          className={`relative inline-flex ${sizeClasses} shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block ${thumbSizeClasses} transform rounded-full bg-white shadow transition-transform ${thumbTranslateClasses}`}
          />
        </button>
        {(onLabel || offLabel) && (
          <span className={`${textSizeClass} text-gray-600 whitespace-nowrap`}>
            {checked ? onLabel : offLabel}
          </span>
        )}
      </div>
    </div>
  );
}
