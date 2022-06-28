import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Channel])],
	providers: [UserService], //, ChannelService],
	controllers: [UserController] //, ChannelController]
})

export class UserModule {}
