import React from 'react';

export function FMSwitch({
  checked = false,
  onChange,
  onLabel,
  offLabel,
  label,
  disabled = false,
  className = ""
}) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      {label && (
        <span className="block text-sm text-gray-600 text-left font-medium">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={handleToggle}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
        {(onLabel || offLabel) && (
          <span className="text-sm text-gray-600">
            {checked ? onLabel : offLabel}
          </span>
        )}
      </div>
    </div>
  );
}
