import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto } from './dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async rateMovie(userId: number, createRatingDto: CreateRatingDto) {
    try {
      const { movieId, value } = createRatingDto;

      // Check if the movie exists
      const movieExists = await this.prisma.movie.findUnique({
        where: { id: movieId },
      });

      if (!movieExists) {
        return { statusCode: 0, message: 'Invalid Movie ID', data: [] };
      }

      // Check if the user has already rated this movie
      const existingRating = await this.prisma.rating.findFirst({
        where: {
          userId,
          movieId,
        },
      });

      if (existingRating) {
        return {
          statusCode: 0,
          message: 'You have already rated this movie.',
          data: [],
        };
      }

      // Create a new rating
      await this.prisma.rating.create({
        data: {
          userId,
          movieId,
          rating: value,
        },
      });

      return {
        statusCode: 1,
        message: `Movie rated successfully with a rating of ${value}.`,
        data: [],
      };
    } catch (error) {
      return {
        statusCode: 0,
        message: 'An error occurred while rating the movie.',
        error: error.message,
      };
    }
  }

  async getMovieRating(movieId: number, userId: number) {
    try {
      const query = await this.prisma.rating.findMany({
        where: { movieId, userId },
        include: {
          movie: true,
        },
      });

      if (query?.length === 0) {
        return {
          statusCode: 0,
          message: `You haven't rated this movie yet.`,
          data: [],
        };
      }
      return {
        statusCode: 1,
        message: `Success`,
        data: query,
      };
    } catch (error) {
      return {
        statusCode: 0,
        message: 'An error occurred while rating the movie.',
        error: error.message,
      };
    }
  }

  async getMovieAverageRating(movieId: number) {
    try {
      const averageRating = await this.prisma.rating.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          movieId,
        },
      });
      if (averageRating?._avg?.rating == null) {
        return {
          statusCode: 0,
          message: `No ratings found against this movie.`,
          data: [],
        };
      }
      return {
        statusCode: 1,
        message: `Success`,
        data: averageRating?._avg,
      };
    } catch (error) {
      return {
        statusCode: 0,
        message: 'An error occurred while rating the movie.',
        error: error.message,
      };
    }
  }
}
