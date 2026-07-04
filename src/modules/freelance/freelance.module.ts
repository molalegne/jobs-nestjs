import { Module } from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { FreelanceController } from './freelance.controller';

@Module({
  providers: [FreelanceService],
  controllers: [FreelanceController],
  exports: [FreelanceService],
})
export class FreelanceModule {}
