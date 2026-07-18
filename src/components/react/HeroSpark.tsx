import { motion } from 'framer-motion';

/** Lightweight React island — Framer Motion presence on the landing. */
export default function HeroSpark() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full border border-mint-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-mint-600 shadow-sm backdrop-blur"
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.35 }}
      whileHover={{ scale: 1.04 }}
    >
      <motion.span
        aria-hidden
        animate={{ rotate: [0, -12, 12, 0], y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        ✨
      </motion.span>
      Connecticat · listo para maullar
    </motion.div>
  );
}
