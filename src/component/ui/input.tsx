import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-10 px-4 border-2 rounded-lg text-sm outline-none transition-colors duration-200',
          error
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
            : 'border-slate-200 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-500',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
