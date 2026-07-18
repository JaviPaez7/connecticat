import { Heart, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import ImageUploader from './ImageUploader';
import { cn } from '@/lib/utils';

export type FeedPost = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  cat: { id: string; name: string; avatarUrl: string; breed: string };
  comments: Array<{
    id: string;
    content: string;
    cat: { id: string; name: string; avatarUrl: string };
  }>;
};

export default function FeedApp({
  initialPosts,
  canInteract,
}: {
  initialPosts: FeedPost[];
  canInteract: boolean;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function publish() {
    if (!canInteract) {
      window.location.href = '/auth/login';
      return;
    }
    if (!imageUrl) {
      setError('Sube una foto primero');
      return;
    }
    setBusy(true);
    setError('');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, caption }),
    });
    setBusy(false);
    if (res.ok) window.location.reload();
    else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'No se pudo publicar');
    }
  }

  async function toggleMeow(postId: string) {
    if (!canInteract) {
      window.location.href = '/auth/login';
      return;
    }
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likedByMe: data.liked, likeCount: data.count } : p,
      ),
    );
  }

  async function comment(postId: string) {
    if (!canInteract) {
      window.location.href = '/auth/login';
      return;
    }
    const content = drafts[postId]?.trim();
    if (!content) return;
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: data.comment.id,
                  content: data.comment.content,
                  cat: data.comment.catProfile,
                },
              ],
            }
          : p,
      ),
    );
    setDrafts((d) => ({ ...d, [postId]: '' }));
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {canInteract && (
        <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl font-bold">Nueva publicación</h2>
          <div className="mt-3 space-y-3">
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              label="Sube tu foto"
              aspect="wide"
            />
            <textarea
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold"
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe un caption…"
            />
            {error && <p className="text-sm font-bold text-coral-600">{error}</p>}
            <Button onClick={publish} disabled={busy || !imageUrl}>
              {busy ? 'Publicando…' : 'Publicar en Catstagram'}
            </Button>
          </div>
        </div>
      )}

      {posts.map((post) => (
        <article
          key={post.id}
          className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-sm backdrop-blur"
        >
          <header className="flex items-center gap-3 px-4 py-3">
            <img
              src={post.cat.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-coral-200"
            />
            <div>
              <p className="font-bold text-ink-900">{post.cat.name}</p>
              <p className="text-xs font-semibold text-ink-500">{post.cat.breed}</p>
            </div>
          </header>
          <img
            src={post.imageUrl}
            alt={post.caption || post.cat.name}
            className="aspect-square w-full object-cover"
          />
          <div className="space-y-3 px-4 py-4">
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleMeow(post.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold transition',
                  post.likedByMe ? 'bg-coral-100 text-coral-600' : 'bg-ink-50 text-ink-700',
                )}
              >
                <Heart className={cn('h-4 w-4', post.likedByMe && 'fill-current')} />
                Meow {post.likeCount}
              </motion.button>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500">
                <MessageCircle className="h-4 w-4" />
                {post.comments.length}
              </span>
            </div>
            {post.caption && (
              <p className="text-sm font-semibold text-ink-800">
                <span className="font-bold">{post.cat.name}</span> {post.caption}
              </p>
            )}
            <ul className="space-y-2">
              {post.comments.map((c) => (
                <li key={c.id} className="text-sm font-semibold text-ink-700">
                  <span className="font-bold text-ink-900">{c.cat.name}</span> {c.content}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-semibold"
                placeholder="Escribe un comentario…"
                value={drafts[post.id] ?? ''}
                onChange={(e) => setDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && comment(post.id)}
              />
              <Button variant="ghost" onClick={() => comment(post.id)} aria-label="Enviar">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      ))}

      {posts.length === 0 && (
        <p className="rounded-3xl bg-white/70 p-8 text-center font-semibold text-ink-500">
          Aún no hay posts. ¡Sé el primero en publicar!
        </p>
      )}
    </div>
  );
}
