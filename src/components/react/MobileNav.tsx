import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Cat,
  Heart,
  LogIn,
  Menu,
  MessagesSquare,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

const links = [
  {
    href: '/feed',
    label: 'Catstagram',
    hint: 'Meows y galerías',
    Icon: Cat,
    accent: 'from-coral-400 to-apricot-400',
  },
  {
    href: '/gatinder',
    label: 'Gatinder',
    hint: 'Swipe y matches',
    Icon: Heart,
    accent: 'from-mint-400 to-sky-400',
  },
  {
    href: '/curiosidades',
    label: 'Curiosidades',
    hint: 'Tips y hábitos',
    Icon: BookOpen,
    accent: 'from-apricot-400 to-coral-400',
  },
  {
    href: '/foro',
    label: 'Purr-Foro',
    hint: 'Comunidad felina',
    Icon: MessagesSquare,
    accent: 'from-sky-400 to-mint-400',
  },
] as const;

type Props = {
  overlay?: boolean;
  pathname: string;
  loggedIn: boolean;
  activeCat?: { name: string; avatarUrl: string } | null;
};

export default function MobileNav({ overlay = false, pathname, loggedIn, activeCat }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const drawer =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              className="fixed inset-0 z-[200] bg-ink-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              className="fixed inset-y-0 right-0 z-[210] flex w-[min(22rem,88vw)] flex-col overflow-hidden border-l border-white/10 bg-ink-900 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_220px_at_100%_0%,rgba(249,112,104,0.35),transparent_55%),radial-gradient(420px_200px_at_0%_100%,rgba(45,212,191,0.22),transparent_50%)]"
              />

              <div className="relative flex items-center justify-between px-5 pb-2 pt-5">
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    Connecti<span className="text-coral-300">cat</span>
                  </p>
                  <p className="text-xs font-semibold text-white/60">Menú felino</p>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {activeCat && (
                <a
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className="relative mx-5 mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3"
                >
                  <img
                    src={activeCat.avatarUrl}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-coral-300/70"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{activeCat.name}</p>
                    <p className="text-xs font-semibold text-white/60">Ver perfil</p>
                  </div>
                </a>
              )}

              <nav className="relative mt-5 flex flex-1 flex-col gap-2 px-4" aria-label="Móvil">
                {links.map((link, i) => {
                  const active =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const Icon = link.Icon;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.06 + i * 0.05,
                        type: 'spring',
                        stiffness: 280,
                        damping: 22,
                      }}
                      className={cn(
                        'group flex items-center gap-3 rounded-2xl border px-3 py-3 transition',
                        active
                          ? 'border-white/20 bg-white/15'
                          : 'border-white/5 bg-white/5 hover:bg-white/10',
                      )}
                    >
                      <span
                        className={cn(
                          'grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg',
                          link.accent,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-base font-bold text-white">
                          {link.label}
                        </span>
                        <span className="block text-xs font-semibold text-white/55">{link.hint}</span>
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              <div className="relative mt-auto space-y-3 border-t border-white/10 px-5 py-5">
                {loggedIn ? (
                  <a
                    href="/perfil"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink-900"
                  >
                    <UserRound className="h-4 w-4" />
                    Ir a perfil
                  </a>
                ) : (
                  <div className="grid gap-2">
                    <a
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink-900"
                    >
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </a>
                    <a
                      href="/auth/registro"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white"
                    >
                      Crear cuenta
                    </a>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative z-[220] inline-flex h-10 w-10 items-center justify-center rounded-xl transition',
          overlay
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'bg-ink-900/5 text-ink-900 hover:bg-ink-900/10',
        )}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {drawer}
    </div>
  );
}
