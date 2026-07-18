import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const avatars = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1533738363-b7f9aef63ac2?w=600&h=600&fit=crop',
];

const posts = [
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900&h=900&fit=crop',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=900&h=900&fit=crop',
  'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=900&h=900&fit=crop',
  'https://images.unsplash.com/photo-1511044568935-2d92d9c36e1f?w=900&h=900&fit=crop',
];

async function main() {
  await prisma.forumVote.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.session.deleteMany();
  await prisma.catProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('miau1234', 12);

  const luna = await prisma.user.create({
    data: {
      email: 'luna@connecticat.dev',
      name: 'Luna Owner',
      passwordHash,
      catProfiles: {
        create: {
          name: 'Luna',
          breed: 'British Shorthair',
          age: 3,
          bio: 'Reina del sofá y experta en cajas de Amazon.',
          avatarUrl: avatars[0],
          interests: ['odiar la aspiradora', 'cajas', 'siestas al sol'],
        },
      },
    },
    include: { catProfiles: true },
  });

  const michi = await prisma.user.create({
    data: {
      email: 'michi@connecticat.dev',
      name: 'Michi Fan',
      passwordHash,
      catProfiles: {
        create: {
          name: 'Michi',
          breed: 'Maine Coon',
          age: 4,
          bio: 'Grande de cuerpo, más grande de corazón. Busco snacks.',
          avatarUrl: avatars[1],
          interests: ['atapar el láser', 'perseguir moscas', 'yogur'],
        },
      },
    },
    include: { catProfiles: true },
  });

  const nala = await prisma.user.create({
    data: {
      email: 'nala@connecticat.dev',
      name: 'Nala House',
      passwordHash,
      catProfiles: {
        create: [
          {
            name: 'Nala',
            breed: 'Siamese',
            age: 2,
            bio: 'Charlatana profesional. Maullo, luego existo.',
            avatarUrl: avatars[2],
            interests: ['hablar', 'alturas', 'cables'],
          },
          {
            name: 'Pixel',
            breed: 'Bengal',
            age: 1,
            bio: 'Energía 200%. Zona de peligro: cortinas.',
            avatarUrl: avatars[3],
            interests: ['escalar', 'madrugadas', 'cazar calcetines'],
          },
        ],
      },
    },
    include: { catProfiles: true },
  });

  const olive = await prisma.user.create({
    data: {
      email: 'olive@connecticat.dev',
      name: 'Olive Keeper',
      passwordHash,
      catProfiles: {
        create: {
          name: 'Olive',
          breed: 'Russian Blue',
          age: 5,
          bio: 'Elegante, misteriosa y fan del atún.',
          avatarUrl: avatars[4],
          interests: ['observar pájaros', 'alfombras mullidas', 'atún'],
        },
      },
    },
    include: { catProfiles: true },
  });

  const cats = [
    luna.catProfiles[0],
    michi.catProfiles[0],
    ...nala.catProfiles,
    olive.catProfiles[0],
  ];

  for (const [i, cat] of cats.entries()) {
    await prisma.post.create({
      data: {
        catProfileId: cat.id,
        imageUrl: posts[i % posts.length],
        caption: `${cat.name} dice: día perfecto para un Meow ✨`,
      },
    });
  }

  const firstPost = await prisma.post.findFirst({ orderBy: { createdAt: 'asc' } });
  if (firstPost) {
    await prisma.like.create({
      data: { postId: firstPost.id, catProfileId: cats[1].id },
    });
    await prisma.comment.create({
      data: {
        postId: firstPost.id,
        catProfileId: cats[2].id,
        content: '¡Qué pose tan elegante! 😻',
      },
    });
  }

  const thread = await prisma.forumThread.create({
    data: {
      catProfileId: cats[0].id,
      title: '¿Cuánta comida húmeda al día?',
      content: 'Luna tiene 3 años y no sé si estoy pasándome con las latitas. ¿Consejos?',
      category: 'salud',
      tags: ['alimentación', 'salud'],
      replies: {
        create: {
          catProfileId: cats[1].id,
          content: 'Depende del peso. En general 2-3 raciones pequeñas + croquetas controladas.',
        },
      },
    },
    include: { replies: true },
  });

  await prisma.forumThread.create({
    data: {
      catProfileId: cats[3].id,
      title: 'Anécdota: se escondió en la maleta',
      content: 'Casi me llevo a Pixel de viaje sin querer. ¡Revisad siempre!',
      category: 'anecdotas',
      tags: ['viaje', 'travieso'],
    },
  });

  await prisma.forumThread.create({
    data: {
      catProfileId: cats[4].id,
      title: 'Mejor rascador de 2026?',
      content: 'Busco algo estable que no se vuelque. ¿Marcas recomendadas?',
      category: 'productos',
      tags: ['rascador', 'compras'],
    },
  });

  if (thread.replies[0]) {
    await prisma.forumVote.create({
      data: {
        replyId: thread.replies[0].id,
        catProfileId: cats[0].id,
        value: 1,
      },
    });
  }

  console.log('Seed OK');
  console.log('Demo login: luna@connecticat.dev / miau1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
