import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import ImageUploader from './ImageUploader';

export default function CatProfileForm() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(1);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [interests, setInterests] = useState('odiar la aspiradora, atapar el láser');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!avatarUrl) {
      setError('Sube una foto de avatar');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          breed,
          age,
          bio,
          avatarUrl,
          interests: interests
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear');
        return;
      }
      window.location.href = '/perfil';
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="mb-2 block text-sm font-bold">Foto del gato</span>
        <ImageUploader value={avatarUrl} onChange={setAvatarUrl} label="Sube el avatar" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-bold">Nombre del gato</span>
          <input
            required
            className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold">Raza</span>
          <input
            required
            className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-bold">Edad (años)</span>
        <input
          type="number"
          min={0}
          max={40}
          required
          className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold">Bio corta</span>
        <textarea
          className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Reina del sofá…"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold">Intereses (separados por coma)</span>
        <input
          className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
      </label>
      {error && (
        <p className="rounded-xl bg-coral-100 px-3 py-2 text-sm font-bold text-coral-700">{error}</p>
      )}
      <Button type="submit" disabled={loading || !avatarUrl} className="w-full py-3">
        {loading ? 'Guardando…' : 'Crear perfil felino'}
      </Button>
    </form>
  );
}
