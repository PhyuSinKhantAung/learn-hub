import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_CALL_BACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, email } = profile._json;
    const filter = { email };
    const payload = { name, email, password: '', googleId: profile.id };

    const user = await this.prisma.user.upsert({
      create: payload,
      update: { email: email.value },
      where: filter,
      select: {
        name: true,
        email: true,
        isActive: true,
        id: true,
      },
    });

    if (!user) return null;

    return user;
  }
}
