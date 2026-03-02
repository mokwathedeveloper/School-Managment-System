'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ComboboxProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: LucideIcon;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  icon: Icon,
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 rounded-xl border-2 border-slate-50 bg-white px-4 font-bold text-sm hover:border-blue-600/20",
            !value && "text-slate-300",
            className
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4 text-slate-300" />}
            <span className="truncate">
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-2xl border-slate-100 shadow-2xl">
        <Command className="rounded-2xl">
          <CommandInput placeholder={searchPlaceholder} className="h-12 border-none focus:ring-0 font-bold" />
          <CommandEmpty className="py-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            {emptyMessage}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto p-2">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="rounded-xl px-4 py-3 font-bold text-sm aria-selected:bg-blue-50 aria-selected:text-blue-600 cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-3 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
