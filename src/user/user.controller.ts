import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  async getMe(@GetUser('id') userId: number) {
    const user = await this.userService.getUserById(userId);

    if (user.id !== userId)
      throw new UnauthorizedException('You are not authorized.');

    return user;
  }
}
