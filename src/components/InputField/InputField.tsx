import React, { useState } from "react";

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
}


export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    value = '',
    onChange,
    label,
    placeholder,
    helperText,
    errorMessage,
    disabled = false,
    invalid = false,
    variant = 'outlined',
    size = 'md',
    loading = false,
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = label?.toLowerCase().includes('password');

  const base = 'block w-full rounded-md focus:outline-none transition';
  const variants: Record<string, string> = {
    filled: 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    outlined: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    ghost: 'bg-transparent border border-transparent focus:border-blue-500 dark:focus:border-blue-400',
  };
  const sizes: Record<string, string> = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };
  const state =
    loading
      ? 'bg-gray-100 text-gray-400 cursor-wait animate-pulse border-blue-200'
      : disabled
      ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
      : invalid
      ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
      : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200" aria-label={label}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type={isPassword && !showPassword ? 'password' : 'text'}
          className={[
            base,
            variants[variant],
            sizes[size],
            state,
            invalid ? 'aria-invalid' : '',
            loading ? 'pr-10' : '',
          ].join(' ')}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          aria-invalid={invalid}
          aria-busy={loading}
          aria-label={label}
        />
        {/* Loading spinner */}
        {loading && (
          <span className="absolute right-2 animate-spin text-blue-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" />
            </svg>
          </span>
        )}
        {/* Clear button */}
        {value && !disabled && !loading && (
          <button
            type="button"
            className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
            onClick={() => onChange && onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
            tabIndex={-1}
            aria-label="Clear input"
          >
            ×
          </button>
        )}
        {/* Password toggle */}
  {isPassword && !loading && (
          <button
            type="button"
            className="absolute right-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {helperText && !invalid && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {invalid && errorMessage && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400" role="alert">{errorMessage}</p>
      )}
    </div>
  );
};
