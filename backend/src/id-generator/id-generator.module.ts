import { Module, Global } from '@nestjs/common';
import { IdGeneratorService } from './id-generator.service.js';

@Global()
@Module({
  providers: [IdGeneratorService],
  exports: [IdGeneratorService],
})
export class IdGeneratorModule {}
