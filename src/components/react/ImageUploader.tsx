import { ImagePlus, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspect?: 'square' | 'wide';
};

export default function ImageUploader({
  value,
  onChange,
  label = 'Subir foto',
  className,
  aspect = 'square',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al subir');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Error de red');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={cn(
          'group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-200 bg-white/70 transition hover:border-coral-300 hover:bg-coral-50/40',
          aspect === 'square' ? 'aspect-square max-h-64' : 'aspect-[16/10] max-h-56',
        )}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-sm font-bold text-ink-500">
            {busy ? <Loader2 className="h-7 w-7 animate-spin text-coral-500" /> : <ImagePlus className="h-7 w-7 text-coral-500" />}
            {busy ? 'Subiendo…' : label}
          </span>
        )}
        {value && !busy && (
          <span className="absolute inset-x-0 bottom-0 bg-ink-900/55 py-2 text-center text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
            Cambiar foto
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {error && <p className="text-sm font-bold text-coral-600">{error}</p>}
    </div>
  );
}
