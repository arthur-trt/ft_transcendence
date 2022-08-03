import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { privateMessage } from 'src/message/privateMessage.entity';
import { MessageModule } from 'src/message/message.module';

@Module({
	imports: [TypeOrmModule.forFeature([User, Channel, privateMessage]), forwardRef(() => MessageModule), forwardRef(() => ChannelModule)],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})

export class UserModule {}
