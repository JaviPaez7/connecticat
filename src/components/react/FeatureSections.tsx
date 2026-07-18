import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Cat, Heart, BookOpen, MessagesSquare, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: string;
  glow: string;
  image: string;
  imageAlt: string;
  Icon: LucideIcon;
  highlights: string[];
  reverse?: boolean;
};

const features: Feature[] = [
  {
    id: 'catstagram',
    eyebrow: 'Red social',
    title: 'Catstagram',
    description:
      'El muro felino: publica fotos, da Meow y comenta. Cada gato tiene su propia galería y personalidad.',
    href: '/feed',
    cta: 'Abrir el feed',
    accent: 'text-coral-500',
    glow: 'from-coral-400/30 via-apricot-300/20 to-transparent',
    image: '/images/section-catstagram.jpg',
    imageAlt: 'Gato mirando a cámara, estilo feed social',
    Icon: Cat,
    highlights: ['Meows al instante', 'Comentarios', 'Galería por perfil'],
  },
  {
    id: 'gatinder',
    eyebrow: 'Matchmaking',
    title: 'Gatinder',
    description:
      'Desliza, maúlla y encuentra química. Si hay match mutuo, lo celebramos con una animación que se siente de verdad.',
    href: '/gatinder',
    cta: 'Empezar a maullar',
    accent: 'text-mint-600',
    glow: 'from-mint-400/30 via-sky-300/15 to-transparent',
    image: '/images/section-gatinder.jpg',
    imageAlt: 'Retrato felino listo para un swipe',
    Icon: Heart,
    highlights: ['Swipe fluido', 'Match mutuo', 'Perfiles aleatorios'],
    reverse: true,
  },
  {
    id: 'curiosidades',
    eyebrow: 'Zona educativa',
    title: 'Curiosidades',
    description:
      'Lecturas rápidas sobre alimentación, comportamiento, salud y rarezas absurdas. Optimizadas para descubrir y compartir.',
    href: '/curiosidades',
    cta: 'Explorar tips',
    accent: 'text-apricot-500',
    glow: 'from-apricot-400/30 via-coral-300/15 to-transparent',
    image: '/images/section-curiosidades.jpg',
    imageAlt: 'Gato curioso junto a una ventana',
    Icon: BookOpen,
    highlights: ['4 categorías', 'Lectura rápida', 'SEO nativo'],
  },
  {
    id: 'foro',
    eyebrow: 'Comunidad',
    title: 'Purr-Foro',
    description:
      'Dudas de salud, anécdotas y recomendaciones. Abre hilos, responde y vota las aportaciones más útiles.',
    href: '/foro',
    cta: 'Entrar al foro',
    accent: 'text-sky-500',
    glow: 'from-sky-400/25 via-mint-300/15 to-transparent',
    image: '/images/section-foro.jpg',
    imageAlt: 'Gatos juntos en ambiente de comunidad',
    Icon: MessagesSquare,
    highlights: ['Categorías claras', 'Respuestas', 'Votos ↑↓'],
    reverse: true,
  },
];

function FeatureBlock({ feature, index }: { feature: Feature; index: number }) {
  const reduce = useReducedMotion();
  const { Icon } = feature;

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const item: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease },
    },
  };

  const media: Variants = {
    hidden: reduce
      ? { opacity: 1, scale: 1, x: 0 }
      : { opacity: 0, scale: 1.06, x: feature.reverse ? 48 : -48 },
    show: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1.05, ease },
    },
  };

  return (
    <section
      id={feature.id}
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby={`${feature.id}-title`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.glow}`}
      />

      <motion.div
        className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35, margin: '0px 0px -8% 0px' }}
      >
        <motion.div
          variants={media}
          className={`relative ${feature.reverse ? 'lg:order-2' : ''}`}
        >
          <div className="relative overflow-hidden rounded-[2rem]">
            <motion.img
              src={feature.image}
              alt={feature.imageAlt}
              className="aspect-[4/3] w-full object-cover"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              transition={{ duration: 0.7, ease }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent" />
          </div>

          <motion.div
            aria-hidden
            className={`absolute -bottom-4 ${feature.reverse ? '-left-4' : '-right-4'} flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-ink-900/10 ${feature.accent}`}
            initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.25 }}
          >
            <Icon className="h-7 w-7" strokeWidth={2.25} />
          </motion.div>
        </motion.div>

        <motion.div variants={container} className={feature.reverse ? 'lg:order-1' : ''}>
          <motion.p
            variants={item}
            className={`text-xs font-bold uppercase tracking-[0.28em] ${feature.accent}`}
          >
            {String(index + 1).padStart(2, '0')} · {feature.eyebrow}
          </motion.p>

          <motion.h2
            id={`${feature.id}-title`}
            variants={item}
            className="font-display mt-3 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl"
          >
            {feature.title}
          </motion.h2>

          <motion.p
            variants={item}
            className="mt-4 max-w-md text-lg font-semibold leading-relaxed text-ink-600"
          >
            {feature.description}
          </motion.p>

          <motion.ul variants={container} className="mt-6 flex flex-wrap gap-2">
            {feature.highlights.map((h) => (
              <motion.li
                key={h}
                variants={item}
                className="rounded-full border border-ink-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-ink-700 backdrop-blur"
              >
                {h}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-8">
            <motion.a
              href={feature.href}
              className="group inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-coral-600"
              whileHover={reduce ? undefined : { x: 4 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              {feature.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function FeatureSections() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <motion.div
        className="mx-auto max-w-6xl px-4 pb-4 pt-16 text-center sm:px-6"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-coral-500">El universo</p>
        <h2 className="font-display mt-3 text-3xl font-bold text-ink-900 sm:text-4xl">
          Cuatro formas de conectar
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-semibold text-ink-500">
          Cada sección tiene su ritmo. Baja y déjalas aparecer.
        </p>
      </motion.div>

      {features.map((feature, index) => (
        <FeatureBlock key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  );
}
