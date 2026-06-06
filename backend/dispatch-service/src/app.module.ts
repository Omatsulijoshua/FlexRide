import { Module } from '@nestjs/common';
import { DispatchModule } from './dispatch/dispatch.module';

@Module({
  imports: [DispatchModule],
})
export class AppModule {}
