import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    console.log({ dto });
    return await this.authService.signup(dto);
  }

  @Get('google-signin')
  @UseGuards(GoogleOAuthGuard)
  async googleSignIn() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    console.log({ req });
    return {
      message: 'hey success',
    };
  }
}
