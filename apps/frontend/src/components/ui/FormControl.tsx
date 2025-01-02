import { cn } from '@/lib/utils';

interface FormControlProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormControl({ label, error, success, hint, children, className }: FormControlProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm text-error-600">{error}</p>
      ) : success ? (
        <p className="text-sm text-success-600">{success}</p>
      ) : hint ? (
        <p className="text-sm text-neutral-600">{hint}</p>
      ) : null}
    </div>
  );
} 