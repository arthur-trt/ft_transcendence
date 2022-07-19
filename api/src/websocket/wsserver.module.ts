import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/channel/channel.module';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { WSServer } from './wsserver.service';
//import { ChatGateway } from './chat.gateway';

@Module({

	imports: [UserModule, MessageModule, JwtModule, ChannelModule],
	providers: [WSServer],
})
export class WSServerModule {}
