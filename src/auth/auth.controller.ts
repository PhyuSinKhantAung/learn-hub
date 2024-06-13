import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: SigninDto) {
    return await this.authService.signin(dto);
  }

  @Get('google-signin')
  @UseGuards(GoogleOAuthGuard)
  async googleSignIn() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @GetUser('id') id: number,
    @GetUser('email') email: string,
    @GetUser('role') role: string,
  ) {
    const payload = { sub: id, email, role };
    return this.authService.generateToken(payload);
  }
}
