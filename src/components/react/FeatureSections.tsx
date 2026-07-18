import { motion, useInView } from 'framer-motion';
import { Cat, Heart, BookOpen, MessagesSquare, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

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

function Reveal({
  children,
  className = '',
  delay = 0,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25, margin: '0px 0px -10% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 56, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 56, x }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function FeatureBlock({ feature, index }: { feature: Feature; index: number }) {
  const { Icon } = feature;
  const mediaX = feature.reverse ? 64 : -64;

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

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className={feature.reverse ? 'lg:order-2' : ''} x={mediaX} delay={0.05}>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-ink-900/10">
              <img
                src={feature.image}
                alt={feature.imageAlt}
                className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div
              className={`absolute -bottom-4 ${feature.reverse ? '-left-4' : '-right-4'} flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ${feature.accent}`}
            >
              <Icon className="h-7 w-7" strokeWidth={2.25} />
            </div>
          </div>
        </Reveal>

        <div className={feature.reverse ? 'lg:order-1' : ''}>
          <Reveal delay={0.1}>
            <p className={`text-xs font-bold uppercase tracking-[0.28em] ${feature.accent}`}>
              {String(index + 1).padStart(2, '0')} · {feature.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <h2
              id={`${feature.id}-title`}
              className="font-display mt-3 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl"
            >
              {feature.title}
            </h2>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mt-4 max-w-md text-lg font-semibold leading-relaxed text-ink-600">
              {feature.description}
            </p>
          </Reveal>
          <Reveal delay={0.34}>
            <ul className="mt-6 flex flex-wrap gap-2">
              {feature.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-ink-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-ink-700 backdrop-blur"
                >
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.42}>
            <a
              href={feature.href}
              className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-coral-600"
            >
              {feature.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function FeatureSections() {
  const introRef = useRef<HTMLDivElement>(null);
  const introInView = useInView(introRef, { once: true, amount: 0.6 });

  return (
    <div className="relative bg-gradient-to-b from-ink-900 from-0% via-coral-50 via-[12%] to-mint-50">
      <motion.div
        ref={introRef}
        className="mx-auto max-w-6xl px-4 pb-4 pt-20 text-center sm:px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={introInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.85, ease }}
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
