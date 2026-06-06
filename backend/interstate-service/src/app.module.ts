import { Module } from '@nestjs/common';
import { InterstateModule } from './interstate/interstate.module';

@Module({
  imports: [InterstateModule],
})
export class AppModule {}
