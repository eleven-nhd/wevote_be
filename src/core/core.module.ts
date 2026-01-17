import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { RealtimeGateway } from './gateway/realtime.gateway';

@Module({
  controllers: [CoreController],
  providers: [CoreService, RealtimeGateway],
  exports: [CoreService, RealtimeGateway],
})
export class CoreModule {}