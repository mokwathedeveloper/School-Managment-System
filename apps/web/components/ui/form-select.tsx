'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-xl border-2 border-slate-50 bg-white px-4 py-2 text-sm font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/10 focus-visible:border-blue-600/20 transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            icon && "pl-12",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export { FormSelect };
