import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAMES } from '../queues/queues.constants';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.APPLICATION },
      { name: QUEUE_NAMES.ANALYTICS },
    ),
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
