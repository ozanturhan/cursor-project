import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormControlProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  isRequired?: boolean;
}

export function FormControl({
  label,
  error,
  success,
  hint,
  children,
  className,
  isRequired,
}: FormControlProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground dark:text-foreground-dark">
          {label}
          {isRequired && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
      {success && (
        <p className="text-sm text-success-500">{success}</p>
      )}
      {hint && (
        <p className="text-sm text-muted dark:text-muted-dark">{hint}</p>
      )}
    </div>
  );
} 