import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'w-full rounded-md border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-neutral-900 placeholder:text-neutral-500',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      variant: {
        default: 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-500',
        error: 'border-error-500 bg-error-50 focus:border-error-500 focus:ring-error-500',
        success: 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500',
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed bg-neutral-100',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      isDisabled: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    type = 'text',
    label,
    error,
    helperText,
    size,
    variant,
    isDisabled = false,
    isLoading = false,
    isSuccess = false,
    rightElement,
    ...props
  }, ref) => {
    // Determine the variant based on state
    let inputVariant = variant;
    if (error) inputVariant = 'error';
    else if (isSuccess) inputVariant = 'success';

    // Default loading spinner
    const loadingSpinner = (
      <svg
        className="animate-spin h-5 w-5 text-neutral-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              inputVariants({ size, variant: inputVariant, isDisabled }),
              (rightElement || isLoading) && 'pr-10',
              className
            )}
            disabled={isDisabled}
            ref={ref}
            {...props}
          />
          {(rightElement || isLoading) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isLoading ? loadingSpinner : rightElement}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 