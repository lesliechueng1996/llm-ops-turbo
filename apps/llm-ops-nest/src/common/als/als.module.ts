import { AsyncLocalStorage } from 'node:async_hooks';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [AsyncLocalStorage],
})
export class AlsModule {}
