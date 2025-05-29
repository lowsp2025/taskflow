import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary: 'bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800',
    ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;