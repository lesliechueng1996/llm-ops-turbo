import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AlsContext } from './als.type';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<AlsContext>) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 为每个请求创建一个新的 context
    this.als.run({ accountId: '' }, () => {
      next();
    });
  }
}
