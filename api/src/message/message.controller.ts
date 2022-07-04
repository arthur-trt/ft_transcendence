import { Controller, Post, Get, Body, Param, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { UUIDVersion } from 'class-validator';
import { channel } from 'diagnostics_channel';
import { Channel } from 'src/channel/channel.entity';
import { getPrivateMessageDto } from 'src/dtos/getPrivateMessageDto';
import { sendChannelMessageDto } from 'src/dtos/sendChannelMessageDto';
import { sendPrivateMessageDto } from 'src/dtos/sendPrivateMessageDto';
import { BaseEntity } from 'typeorm';
import { channelMessage } from './channelMessage.entity';
import { MessageService } from './message.service';


@Controller('message')

export class MessageController {

	constructor(private messageService: MessageService) { }

/*
** CHANNEL
*/
	@Post('channel/sendMsg/:identifier')
	@UsePipes(ValidationPipe)
	public async sendMessage(@Param('identifier') chanIdentifier : string, @Body() query : sendChannelMessageDto)
	{
		const sender = query.sender;
		const msg = query.msg;
		return await this.messageService.sendMessageToChannel(chanIdentifier, sender, msg);
	}

	@Get('channel/getMsg/:identifier') // can be string or uuid but all are type of string
	public async getMessages(@Param('identifier') chanIdentifier : string)
	{
		const messages = await this.messageService.getMessage(chanIdentifier)
		return  messages;
	}

/*
** PRIVATE
*/

	@Post('privateMessage/sendMsg')
	@UsePipes(ValidationPipe)
	public async privateMessage(@Body() query : sendPrivateMessageDto)
	{
		const sender = query.sender;
		const target = query.target;
		const msg = query.msg;
		return await this.messageService.sendPrivateMessage(sender, target, msg);
	}

	@Get('privateMessage/')
	@UsePipes(ValidationPipe)
	public async getPrivateMessage(@Body() query : getPrivateMessageDto)
	{
		const sender = query.sender;
		const target = query.target;
		return await this.messageService.getPrivateMessage(sender, target);
	}



}
