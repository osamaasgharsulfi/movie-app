import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  async getRecommendedMovies(userId: number) {
    try {
      // Get movies with their average rating
      const moviesWithAvgRatings = await this.prisma.movie.findMany({
        include: {
          ratings: true,
          category: true,
        },
      });

      console.log(moviesWithAvgRatings)

      // Calculate the average rating for each movie
      const moviesWithRatings = moviesWithAvgRatings.map((movie) => {
        const totalRatings = movie.ratings.reduce(
          (acc, rating) => acc + rating.rating,
          0,
        );
        const avgRating = movie.ratings.length
          ? totalRatings / movie.ratings.length
          : 0;

        return {
          movieId: movie.id,
          title: movie.title,
          description: movie.description,
          category: movie.category.name,
          rating: avgRating,
          image: movie?.image
        };
      });

      // Sort movies by their average rating in descending order
      const sortedMovies = moviesWithRatings.sort(
        (a, b) => b.rating - a.rating,
      );

      return {
        statusCode: 1,
        message: 'Recommended list is ',
        data: sortedMovies.slice(0, 10),
      };
    } catch (error) {
      return { statusCode: 0, message: 'Error Occured', error: error.message };
    }
  }
}
