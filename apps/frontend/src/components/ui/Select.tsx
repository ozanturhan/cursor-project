import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const selectVariants = cva(
  'w-full rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-primary-500',
        error: 'border border-error-300 bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-error-500',
      },
      selectSize: {
        sm: 'h-8 px-2 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'md',
      isDisabled: false,
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<VariantProps<typeof selectVariants>, 'size'> {
  isDisabled?: boolean;
  hasError?: boolean;
  selectSize?: 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
  variant = 'default',
  selectSize = 'md',
  isDisabled = false,
  hasError = false,
  className,
  children,
  ...props
}) => {
  const selectVariant = hasError ? 'error' : variant;
  
  return (
    <select
      className={selectVariants({ variant: selectVariant, selectSize, isDisabled: !!isDisabled })}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </select>
  );
}; 