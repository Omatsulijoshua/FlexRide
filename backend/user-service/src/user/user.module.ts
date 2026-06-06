import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, DatabaseService],
})
export class UserModule {}
