import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRatingDto } from './dto';
import { RatingService } from './rating.service';
import { JwtGuard } from 'nest-auth-package';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post('rateMovie')
  async rateMovie(
    @Body() createRatingDto: CreateRatingDto,
    @GetUser('id') userId: number,
  ) {
    return this.ratingService.rateMovie(userId, createRatingDto);
  }

  @Get('/getRating/:id')
  async getMovieRating(@Param('id') id: number, @GetUser('id') userId: number) {
    return this.ratingService.getMovieRating(+id, userId);
  }

  @Get('/averageRating/:id')
  async getMovieAverageRating(@Param('id') id: number){
    return this.ratingService.getMovieAverageRating(+id)
  }
}
