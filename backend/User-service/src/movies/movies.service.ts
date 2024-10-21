import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getAllMoviesWithCategories() {
    try {
      const query = await this.prisma.movie.findMany({
        include: {
          category: true, // Include the associated category
          ratings: true,
        },
      });

      const data = query.map((d) => {
        return {
          id: d.id,
          title: d?.title,
          description: d?.description,
          categoryId: d?.categoryId,
          category: d?.category?.name,
          Movierating: d?.ratings[0]?.rating || null,
          image: d?.image
        };
      });

      if (data.length > 0) {
        return { statusCode: 1, message: 'success', data };
      } else {
        return { statusCode: 1, message: 'No movies found', data: [] };
      }
    } catch (error) {
      return { statusCode: 0, message: 'Error Occurred', error: error.message };
    }
  }

  async getMovieById(movieId: number) {
    try {
      const data = await this.prisma.movie.findUnique({
        where: { id: movieId },
        include: {
          category: true,
          ratings: true
        },
      });


      if (data) {
        return { statusCode: 1, message: 'success', data };
      } else {
        return {
          statusCode: 1,
          message: 'Movie not found',
          data: null,
        };
      }
    } catch (error) {
      return { statusCode: 0, message: 'Error Occurred', error: error.message };
    }
  }
}
