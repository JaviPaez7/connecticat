import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroLanding() {
  return (
    <section className="relative isolate min-h-svh w-full overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <img
          src="/images/hero-cats.jpg"
          alt=""
          className="h-full w-full object-cover object-[center_30%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/55 to-coral-700/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/40" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-coral-400/25 blur-3xl"
        animate={{ y: [0, -18, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-24 h-80 w-80 rounded-full bg-mint-300/20 blur-3xl"
        animate={{ y: [0, 16, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
        <motion.p
          className="font-display text-sm font-bold uppercase tracking-[0.28em] text-coral-200"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
        >
          Connecticat
        </motion.p>

        <h1 className="font-display mt-4 max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
          >
            Donde los gatos
          </motion.span>
          <motion.span
            className="mt-2 block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.28 }}
          >
            <span className="bg-gradient-to-r from-coral-300 via-apricot-300 to-mint-300 bg-clip-text text-transparent">
              conectan
            </span>
            <span className="text-white"> de verdad</span>
          </motion.span>
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-lg font-semibold text-white/85 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.4 }}
        >
          La red social donde los gatos hacen match. Feed, curiosidades y foro con energía felina.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.52 }}
        >
          <motion.a
            href="/auth/registro"
            className="rounded-2xl bg-gradient-to-r from-coral-500 to-apricot-400 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-coral-900/40"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Crear cuenta
          </motion.a>
          <motion.a
            href="/gatinder"
            className="rounded-2xl border-2 border-white/40 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-md"
            whileHover={{ scale: 1.04, y: -2, backgroundColor: 'rgba(255,255,255,0.18)' }}
            whileTap={{ scale: 0.98 }}
          >
            Probar Gatinder
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.1, duration: 0.5 },
          y: { delay: 1.1, duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="h-9 w-5 rounded-full border-2 border-white/50 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/80" />
        </div>
      </motion.div>
    </section>
  );
}
