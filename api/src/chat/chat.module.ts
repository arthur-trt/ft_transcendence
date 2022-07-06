import { Module } from '@nestjs/common';
import { AlertController } from 'src/chat/alert/alert.controller';
import { AlertGateway } from 'src/chat/alert/alert.gateway';
import { ChatGateway } from './chat.gateway';

@Module({
	providers: [ChatGateway, AlertGateway],
	controllers : [AlertController]
})
export class ChatModule {}
