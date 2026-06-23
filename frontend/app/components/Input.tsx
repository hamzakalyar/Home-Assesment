import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

/** Shared text input primitive. Usually rendered through FormField. */
export function Input({ hasError = false, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-md border px-3 py-2 text-sm text-slate-900 outline-none',
        'focus:ring-2 focus:ring-slate-400',
        hasError ? 'border-red-500' : 'border-slate-300',
        className,
      )}
      {...props}
    />
  );
}
