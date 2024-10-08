import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { MoviesService } from './movies.service';

@UseGuards(JwtGuard)
@Controller('movies')
export class MoviesController {
  constructor(private MoviesService: MoviesService) {}

  @Get('getAllMoviesWithCategories')
  async getAllMoviesWithCategories() {
    return this.MoviesService.getAllMoviesWithCategories();
  }

  @Get('getMovie/:id')
  async getMovieById(@Param('id') id: number) {
    return this.MoviesService.getMovieById(+id);
  }
}
