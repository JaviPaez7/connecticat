import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { AstroCookies } from 'astro';
import { prisma } from './db';

const SESSION_COOKIE = 'connecticat_session';
const SESSION_DAYS = 14;

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthCat = {
  id: string;
  name: string;
  breed: string;
  age: number;
  bio: string;
  avatarUrl: string;
  interests: string[];
};

export type SessionContext = {
  user: AuthUser;
  cats: AuthCat[];
  activeCat: AuthCat | null;
};

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId: string, cookies: AstroCookies) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      token: hashToken(token),
      expiresAt,
    },
  });

  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    expires: expiresAt,
  });
}

export async function destroySession(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token: hashToken(token) } });
  }
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function getSession(cookies: AstroCookies): Promise<SessionContext | null> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token: hashToken(token) },
    include: {
      user: {
        include: {
          catProfiles: { orderBy: { createdAt: 'asc' } },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    }
    cookies.delete(SESSION_COOKIE, { path: '/' });
    return null;
  }

  const activeCatId = cookies.get('connecticat_active_cat')?.value;
  const cats = session.user.catProfiles.map((c) => ({
    id: c.id,
    name: c.name,
    breed: c.breed,
    age: c.age,
    bio: c.bio,
    avatarUrl: c.avatarUrl,
    interests: c.interests,
  }));

  const activeCat = cats.find((c) => c.id === activeCatId) ?? cats[0] ?? null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    cats,
    activeCat,
  };
}

export function setActiveCat(cookies: AstroCookies, catId: string) {
  cookies.set('connecticat_active_cat', catId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function requireUser(session: SessionContext | null): SessionContext {
  if (!session) {
    throw new Response(null, {
      status: 302,
      headers: { Location: '/auth/login' },
    });
  }
  return session;
}

export function requireActiveCat(session: SessionContext | null): AuthCat {
  const s = requireUser(session);
  if (!s.activeCat) {
    throw new Response(null, {
      status: 302,
      headers: { Location: '/perfil/nuevo' },
    });
  }
  return s.activeCat;
}
