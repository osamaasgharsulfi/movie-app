import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'nest-auth-package';
import { UserService } from './users.service';
import { UpdateUserProfileDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Put('updateProfile')
  async updateUserProfile(
    @GetUser('id') userId: number,
    @Body()
    dto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(userId, dto);
  }
}
