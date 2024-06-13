import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export default class implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(req: Request, res: Response, next: NextFunction) {
    res.send('Welcome from Learn-Hub API');
  }
}
