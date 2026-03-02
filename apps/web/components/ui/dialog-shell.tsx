'use client';

import * as React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DialogShell({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  footerActions,
  className,
  headerClassName
}: DialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[520px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white",
        className
      )}>
        {/* High Contrast Header */}
        <div className={cn(
          "bg-slate-900 p-8 text-white relative overflow-hidden",
          headerClassName
        )}>
          {Icon && (
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Icon className="h-24 w-24" />
            </div>
          )}
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6">
          {children}
          
          {footerActions && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
              {footerActions}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
