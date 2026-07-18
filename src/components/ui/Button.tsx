import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'mint';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-coral-500 to-apricot-400 text-white shadow-lg shadow-coral-300/40 hover:scale-[1.02]',
  secondary:
    'border-2 border-mint-300 bg-white/70 text-mint-700 hover:bg-mint-50 hover:border-mint-400',
  ghost: 'bg-white/50 text-ink-700 hover:bg-white/80',
  danger: 'bg-ink-900 text-white hover:bg-coral-600',
  mint: 'bg-mint-400 text-ink-900 font-bold hover:bg-mint-300',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
