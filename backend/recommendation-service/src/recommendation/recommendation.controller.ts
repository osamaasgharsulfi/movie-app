import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { GetUser } from './decorator/get-user.decorator';
import { JwtGuard } from 'nest-auth-package';

@UseGuards(JwtGuard)
@Controller('recommendation')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get('giveRating')
  async getRecommendations(@GetUser('id') userId: number) {
    const recommendations =
      await this.recommendationService.getRecommendedMovies(+userId);
    return recommendations;
  }
}
