import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from './friendships.service';
import { Friendships } from './frienship.entity';

@Module({
  controllers: [FriendshipsController],
	providers: [FriendshipsService],
	exports: [FriendshipsService],
  imports : [TypeOrmModule.forFeature([Friendships])]
})
export class FriendshipsModule {}
