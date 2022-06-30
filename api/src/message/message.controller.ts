import { Controller, Post, Get, Param} from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { Channel } from 'src/channel/channel.entity';
import { BaseEntity } from 'typeorm';
import { channelMessage } from './channelMessage.entity';
import { MessageService } from './message.service';


@Controller('message')
export class MessageController {

	constructor(private messageService: MessageService) { }

	@Post('channel')
	public async sendMessage()
	{
		return await this.messageService.sendMessageToChannel();
	}

	@Get('channel/:name')
	public async getMessages(@Param('name') chanName : string)
	{
		const messages = await this.messageService.getMessage(chanName)
		return  messages;
	}


}
