import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';

type Mode = 'login' | 'register';

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login' ? { email, password } : { email, password, name: name || undefined },
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Algo falló');
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
      {mode === 'register' && (
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-700">Nombre</span>
          <input
            className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />
        </label>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-700">Email</span>
        <input
          type="email"
          required
          className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-700">Contraseña</span>
        <input
          type="password"
          required
          minLength={6}
          className="w-full rounded-2xl border border-ink-200 bg-white/80 px-4 py-3 font-semibold outline-none ring-coral-300 focus:ring-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-coral-100 px-3 py-2 text-sm font-bold text-coral-700">{error}</p>
      )}

      <Button type="submit" disabled={loading} className="w-full py-3">
        {loading ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
