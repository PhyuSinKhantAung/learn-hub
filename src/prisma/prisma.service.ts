import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://admin:1234@dmin!!!@localhost:5433/learnhubDB?schema=public',
        },
      },
    });
  }
}
