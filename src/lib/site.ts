/** Site-wide constants for Connecticat. */
export const site = {
  name: 'Connecticat',
  tagline: 'La red social donde los gatos hacen match',
  description:
    'Feed felino, Gatinder, curiosidades y foro para amantes de los gatos. Conecta perfiles, da Meows y encuentra el match perfecto.',
  url: 'https://connecticat.javistudio.dev',
  locale: 'es-ES',
} as const;

export const navLinks = [
  { href: '/feed', label: 'Catstagram' },
  { href: '/gatinder', label: 'Gatinder' },
  { href: '/curiosidades', label: 'Curiosidades' },
  { href: '/foro', label: 'Purr-Foro' },
] as const;
