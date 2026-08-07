import React from 'react';
import { Link } from 'react-router-dom';

export function FMButton({
  children,
  onClick,
  href,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  className = '',
  isInline = true,
}) {
  const baseClasses = 'inline-flex items-center rounded-lg border border-gray outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
    secondary: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-500',
    green: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
    yellow: 'bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500',
    danger: 'bg-red-500 text-white hover:bg-red-700 border-red-500',
    'danger-outline': 'bg-white text-red-600 hover:bg-red-50 border-red-600',
    outline: 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300',
  };

  const sizeClassesMap = {
    small: 'px-2 py-1 text-xs font-semibold justify-center',
    medium: 'px-3 py-2 text-sm font-semibold justify-center',
    large: 'px-4 py-3 text-base font-semibold justify-center',
  };

  const sizeClasses = sizeClassesMap[size] || sizeClassesMap.medium;

  const content = (
    <>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </>
  );

  const buttonElement = href ? (
    <Link
      to={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`}
    >
      {content}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`}
    >
      {content}
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
