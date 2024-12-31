import React from 'react';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  isRequired,
  children,
  className,
  ...props
}) => {
  return (
    <label
      className={`block text-sm font-medium text-neutral-700 mb-1 ${className || ''}`}
      {...props}
    >
      {children}
      {isRequired && <span className="text-error-500 ml-1">*</span>}
    </label>
  );
}; 