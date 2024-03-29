import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private userService: UserService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(dto: SignupDto) {
    try {
      const user = await this.userService.createUser(dto);

      const payload = { sub: user.id, email: user.email, role: user.role };

      return this.generateToken(payload);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    console.log({ user });

    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await argon.verify(user.password, dto.password);
    console.log({ isValidPassword });

    if (!isValidPassword) throw new ForbiddenException('Credentials incorrect');

    const payload = { sub: user.id, email: user.email, role: user.role };

    console.log({ payload });
    return this.generateToken(payload);
  }

  async generateToken(payload: {
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

  async hashedUserPassword(password: string) {
    return await argon.hash(password);
  }
}
