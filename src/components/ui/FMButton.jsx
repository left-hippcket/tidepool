import React from 'react';

export function FMButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  icon,
  className = '',
  isInline = true,
}) {
  const baseClasses = 'inline-flex items-center rounded-lg border border-gray outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600',
    green: 'bg-green-600 text-white hover:bg-green-700',
  };

  const sizeClasses = 'px-3 py-2 text-sm font-semibold justify-center';

  const buttonElement = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );

  if (isInline) {
    return (
      <div className="inline-flex flex-col gap-1">
        {buttonElement}
      </div>
    );
  }

  return buttonElement;
}
