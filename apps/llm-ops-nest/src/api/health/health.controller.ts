import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DemoProducer } from 'src/producer/demo.producer';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly demoProducer: DemoProducer) {}

  @Get()
  @ApiOperation({ summary: 'Ping' })
  async ping() {
    this.demoProducer.test();
    return 'pong';
  }
}
