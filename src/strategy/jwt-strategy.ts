import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    console.log({ payload });

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        name: true,
        email: true,
        isActive: true,
        role: true,
        id: true,
      },
    });

    if (!user) return null;

    return user;
  }
}
