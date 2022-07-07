import { Module } from '@nestjs/common';
import { AlertController } from 'src/chat/alert/alert.controller';
import { AlertGateway } from 'src/chat/alert/alert.gateway';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';

@Module({

	imports: [UserModule],
	providers: [ChatGateway, AlertGateway],
	controllers : [AlertController]
})
export class ChatModule {}
