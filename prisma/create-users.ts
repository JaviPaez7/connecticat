import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const passwordHash = await bcrypt.hash('miau1234', 12);

const users = [
  {
    email: 'mico@connecticat.dev',
    name: 'Mico Owner',
    cat: {
      name: 'Mico',
      breed: 'Orange Tabby',
      age: 2,
      bio: 'Travieso profesional y fan del atún.',
      avatarUrl:
        'https://images.unsplash.com/photo-1533738363-b7f9aef63ac2?w=600&h=600&fit=crop',
      interests: ['cajas', 'madrugar', 'perseguir sombras'],
    },
  },
  {
    email: 'holly@connecticat.dev',
    name: 'Holly Owner',
    cat: {
      name: 'Holly',
      breed: 'Calico',
      age: 3,
      bio: 'Elegante, curiosa y un poco diva.',
      avatarUrl:
        'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=600&fit=crop',
      interests: ['ventanas', 'mimos selectivos', 'cajas premium'],
    },
  },
  {
    email: 'lucky@connecticat.dev',
    name: 'Lucky Owner',
    cat: {
      name: 'Lucky',
      breed: 'Tuxedo',
      age: 4,
      bio: 'Afortunado en snacks y siestas largas.',
      avatarUrl:
        'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop',
      interests: ['yogur', 'sofá', 'odiar la aspiradora'],
    },
  },
];

for (const item of users) {
  const existing = await prisma.user.findUnique({ where: { email: item.email } });
  if (existing) {
    console.log('exists', item.email);
    continue;
  }
  await prisma.user.create({
    data: {
      email: item.email,
      name: item.name,
      passwordHash,
      catProfiles: { create: item.cat },
    },
  });
  console.log('created', item.email);
}

await prisma.$disconnect();
