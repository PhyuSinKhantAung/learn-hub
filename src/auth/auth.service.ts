import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.userService.createUser(dto);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.signToken(payload);
  }

  async signToken(payload: {
    sub: number;
    email: string;
    role: string;
  }): Promise<{ accessToken: string }> {
    const accessToken = this.jwt.sign(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });
    return { accessToken };
  }
}
