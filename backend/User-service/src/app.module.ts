import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'nest-auth-package';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RatingModule } from './rating/rating.module';
import { authModule } from './auth/auth.module';

@Module({
  imports: [
    authModule,
    UsersModule,
    MoviesModule,
    CategoriesModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RatingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
