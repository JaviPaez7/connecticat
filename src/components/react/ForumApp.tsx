import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export type ForumThreadCard = {
  id: string;
  title: string;
  content: string;
  category: 'salud' | 'anecdotas' | 'productos';
  tags: string[];
  createdAt: string;
  replyCount: number;
  author: { name: string; avatarUrl: string };
};

const labels = {
  salud: 'Dudas de salud',
  anecdotas: 'Anécdotas',
  productos: 'Productos',
} as const;

export function ForumCreateForm({ canPost }: { canPost: boolean }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'salud' | 'anecdotas' | 'productos'>('salud');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canPost) {
      window.location.href = '/auth/login';
      return;
    }
    const res = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        category,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error');
      return;
    }
    window.location.href = `/foro/${data.thread.id}`;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/70 bg-white/70 p-5">
      <h2 className="font-display text-xl font-bold">Nuevo hilo</h2>
      <input
        required
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold"
        value={category}
        onChange={(e) => setCategory(e.target.value as typeof category)}
      >
        {Object.entries(labels).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
      <textarea
        required
        rows={4}
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold"
        placeholder="Cuéntanos…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold"
        placeholder="Etiquetas (coma)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      {error && <p className="text-sm font-bold text-coral-600">{error}</p>}
      <Button type="submit">Publicar hilo</Button>
    </form>
  );
}

export function ForumReplyForm({ threadId, canPost }: { threadId: string; canPost: boolean }) {
  const [content, setContent] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canPost) {
      window.location.href = '/auth/login';
      return;
    }
    const res = await fetch('/api/forum/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, content }),
    });
    if (res.ok) window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <textarea
        required
        rows={3}
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold"
        placeholder="Tu respuesta…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit">Responder</Button>
    </form>
  );
}

export function VoteButtons({
  replyId,
  initialScore,
  initialMine,
  canVote,
}: {
  replyId: string;
  initialScore: number;
  initialMine: number;
  canVote: boolean;
}) {
  const [score, setScore] = useState(initialScore);
  const [mine, setMine] = useState(initialMine);

  async function vote(value: 1 | -1) {
    if (!canVote) {
      window.location.href = '/auth/login';
      return;
    }
    const res = await fetch('/api/forum/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyId, value }),
    });
    const data = await res.json();
    if (!res.ok) return;
    setScore(data.score);
    setMine(data.mine);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => vote(1)}
        className={cn(
          'rounded-lg p-1 transition',
          mine === 1 ? 'bg-mint-100 text-mint-600' : 'text-ink-400 hover:bg-ink-50',
        )}
        aria-label="Voto a favor"
      >
        <ArrowBigUp className="h-5 w-5" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold">{score}</span>
      <button
        type="button"
        onClick={() => vote(-1)}
        className={cn(
          'rounded-lg p-1 transition',
          mine === -1 ? 'bg-coral-100 text-coral-600' : 'text-ink-400 hover:bg-ink-50',
        )}
        aria-label="Voto en contra"
      >
        <ArrowBigDown className="h-5 w-5" />
      </button>
    </div>
  );
}

export function categoryLabel(c: keyof typeof labels) {
  return labels[c];
}
