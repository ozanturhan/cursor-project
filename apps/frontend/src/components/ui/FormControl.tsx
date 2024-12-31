import React from 'react';

export interface FormControlProps {
  label: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  children: React.ReactNode;
}

export const FormControl: React.FC<FormControlProps> = ({
  label,
  error,
  helperText,
  isRequired,
  children,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
        {isRequired && <span className="text-error-500 ml-1">*</span>}
      </label>
      {children}
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}; 