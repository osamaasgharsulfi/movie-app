import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Categories List
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Action' },
      { name: 'Horror' },
      { name: 'Comedy' },
      { name: 'Animated' },
      { name: 'Thriller' },
      { name: 'Scientific' },
    ],
  });

  // Movies List
  const movies = await prisma.movie.createMany({
    data: [
      { title: 'Die Hard', description: 'Action movie', categoryId: 5, image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSo4rynrhfsiBKcV57MBiwg66Nk91gp2OtOWsGMQzkOeAbBByN3' },
      { title: 'The Conjuring', description: 'Horror movie', categoryId: 2, image : 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTTom_YFyhdPL_hw7a4QxB75uy9RNUGdRIDqieXM_1vm29zo0Id' },
      { title: 'The Hangover', description: 'Comedy movie', categoryId: 3, image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRWuhUtUEH-YWbeUfEEkJ3FmgrM9wJfo0DBtdR_tqvLNPXn7KNu' },
      { title: 'Toy Story', description: 'Animated movie', categoryId: 4, image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ3I1sd7LSAioEZqY-ildb4OvNHvbc7QkxS5sOvQB_PUQfhZJz2' },
    ],
  });

  // Seed one user
  const hashedPassword = await bcrypt.hash('12345', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Osama Asghar',
      email: 'osamaasghar@gmail.com',
      password: hashedPassword,
      image: 'some image, bucket link here!',
      dob: '2000-01-14T00:00:00.000Z',
      address: 'xyz',
      categories: {
        connect: [{ id: 1 }, { id: 4 }, { id: 3 }],
      },
      categoryIds: [1, 4, 3],
    },
  });

  console.log({ categories, movies, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
