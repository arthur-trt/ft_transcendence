import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChannelModule } from 'src/channel/channel.module';
import { FriendshipsModule } from 'src/friendships/friendships.module';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { ChatService } from './chat.service';
import { ConnectService } from './connect.service';
import { WSServer } from './wsserver.gateway';
import { GameModule } from 'src/game/game.module';
//import { ChatGateway } from './chat.gateway';

@Module({

	imports: [UserModule, MessageModule, JwtModule, ChannelModule, FriendshipsModule, GameModule],
	providers: [WSServer, ChatService, ConnectService],

export class WSServerModule {}
