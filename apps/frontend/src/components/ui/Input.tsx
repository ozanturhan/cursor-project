import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'w-full rounded-md border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
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
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed bg-neutral-100',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, size, variant, isDisabled = false, ...props }, ref) => {
    // If there's an error, switch to error variant
    const inputVariant = error ? 'error' : variant;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={inputVariants({ size, variant: inputVariant, isDisabled })}
          disabled={isDisabled}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
); 