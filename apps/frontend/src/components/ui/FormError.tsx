import React from 'react';

export interface FormErrorProps {
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <p className={`mt-1 text-sm text-error-500 ${className || ''}`}>
      {error}
    </p>
  );
}; 