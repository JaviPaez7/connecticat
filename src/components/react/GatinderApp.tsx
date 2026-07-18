import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export type GatinderCat = {
  id: string;
  name: string;
  breed: string;
  age: number;
  bio: string;
  avatarUrl: string;
  interests: string[];
};

type MatchInfo = { id: string; other: { id: string; name: string; avatarUrl: string } };

export default function GatinderApp({ canPlay }: { canPlay: boolean }) {
  const [deck, setDeck] = useState<GatinderCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [exitX, setExitX] = useState(0);
  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!canPlay) {
      setLoading(false);
      return;
    }
    fetch('/api/gatinder/deck')
      .then((r) => r.json())
      .then((d) => setDeck(d.deck ?? []))
      .finally(() => setLoading(false));
  }, [canPlay]);

  const current = deck[0];

  async function swipe(type: 'like' | 'dislike') {
    if (!current || busy) return;
    setBusy(true);
    setExitX(type === 'like' ? 420 : -420);
    const swipedId = current.id;

    const res = await fetch('/api/gatinder/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swipedId, type }),
    });
    const data = await res.json();

    setTimeout(() => {
      setDeck((d) => d.slice(1));
      setExitX(0);
      setBusy(false);
      if (data.match) setMatch(data.match);
    }, 280);
  }

  if (!canPlay) {
    return (
      <div className="rounded-3xl bg-white/70 p-8 text-center backdrop-blur">
        <p className="font-semibold text-ink-600">Inicia sesión y crea un perfil de gato para jugar.</p>
        <a href="/auth/login" className="mt-4 inline-block font-bold text-coral-600 hover:underline">
          Ir a login →
        </a>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center font-bold text-ink-500">Cargando candidatos…</p>;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      <div className="relative h-[520px] w-full">
        <AnimatePresence>
          {current ? (
            <motion.div
              key={current.id}
              className="absolute inset-0 touch-none select-none overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-xl"
              style={{ touchAction: 'none' }}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ x: exitX, opacity: 0, rotate: exitX > 0 ? 12 : -12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100 || info.velocity.x > 500) void swipe('like');
                else if (info.offset.x < -100 || info.velocity.x < -500) void swipe('dislike');
              }}
            >
              <img
                src={current.avatarUrl}
                alt={current.name}
                draggable={false}
                className="pointer-events-none h-[62%] w-full select-none object-cover"
              />
              <div className="pointer-events-none space-y-2 p-5">
                <h2 className="font-display text-3xl font-bold text-ink-900">
                  {current.name}, {current.age}
                </h2>
                <p className="text-sm font-bold text-mint-600">{current.breed}</p>
                <p className="text-sm font-semibold text-ink-600">{current.bio}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {current.interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-full bg-apricot-100 px-3 py-1 text-xs font-bold text-apricot-500"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 grid place-items-center rounded-[2rem] border border-dashed border-mint-300 bg-white/60 p-8 text-center"
            >
              <div>
                <p className="font-display text-2xl font-bold">No hay más gatos por ahora</p>
                <p className="mt-2 font-semibold text-ink-500">Vuelve más tarde o invita amigos.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {current && (
        <div className="mt-6 flex items-center gap-6">
          <Button
            variant="ghost"
            className="h-16 w-16 rounded-full border-2 border-ink-200 !p-0"
            onClick={() => swipe('dislike')}
            disabled={busy}
            aria-label="Descartar"
          >
            <X className="h-7 w-7 text-ink-600" />
          </Button>
          <Button
            variant="mint"
            className="h-16 w-16 rounded-full !p-0 shadow-lg shadow-mint-300/50"
            onClick={() => swipe('like')}
            disabled={busy}
            aria-label="Maullar"
          >
            <Heart className="h-7 w-7 fill-current" />
          </Button>
        </div>
      )}

      <AnimatePresence>
        {match && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-ink-900/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <p className="font-display text-3xl font-bold text-coral-500">¡Hay Match!</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <img
                  src={match.other.avatarUrl}
                  alt=""
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-mint-200"
                />
              </div>
              <p className="mt-4 font-semibold text-ink-700">
                Tú y <span className="font-bold text-ink-900">{match.other.name}</span> se han maullado
              </p>
              <Button className="mt-6 w-full" onClick={() => setMatch(null)}>
                Seguir explorando
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
