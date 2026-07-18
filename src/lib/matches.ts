import { prisma } from './db';

/** Canonical order so A↔B is stored once. */
export function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function createMatchIfMutual(swiperId: string, swipedId: string) {
  const reciprocal = await prisma.swipe.findUnique({
    where: {
      swiperId_swipedId: { swiperId: swipedId, swipedId: swiperId },
    },
  });

  if (!reciprocal || reciprocal.type !== 'like') {
    return null;
  }

  const [catOneId, catTwoId] = orderedPair(swiperId, swipedId);

  return prisma.match.upsert({
    where: { catOneId_catTwoId: { catOneId, catTwoId } },
    create: { catOneId, catTwoId },
    update: {},
    include: {
      catOne: true,
      catTwo: true,
    },
  });
}
