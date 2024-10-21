import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'nest-auth-package';

@Module({
  imports: [
    RecommendationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
