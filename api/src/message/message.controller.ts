import { Controller, Post, Get, Body, Param, Query, UsePipes, ValidationPipe, Req, UseGuards} from '@nestjs/common';
import { UUIDVersion } from 'class-validator';
import { channel } from 'diagnostics_channel';
import { Channel } from 'src/channel/channel.entity';
import { getPrivateMessageDto } from 'src/dtos/getPrivateMessageDto.dto';
import { sendChannelMessageDto } from 'src/dtos/sendChannelMessageDto.dto';
import { sendPrivateMessageDto } from 'src/dtos/sendPrivateMessageDto.dto';
import { BaseEntity } from 'typeorm';
import { channelMessage } from './channelMessage.entity';
import { MessageService } from './message.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('message')

export class MessageController {

	constructor(private messageService: MessageService) { }

	/*
	** CHANNEL
	*/

	@Post('channel/sendMsg/:identifier')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async sendMessage(@Param('identifier') chanIdentifier : string, @Req() req : Request, @Body() query : sendChannelMessageDto)
	{
		const msg = query.msg;
		return await this.messageService.sendMessageToChannel(chanIdentifier, req, msg);
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
	@UseGuards(JwtAuthGuard)
	public async privateMessage(@Req() req : Request, @Body() query : sendPrivateMessageDto)
	{
		const target = query.target;
		const msg = query.msg;
		return await this.messageService.sendPrivateMessage(req, target, msg);
	}

	@Get('privateMessage/')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async getPrivateMessage(@Req() req : Request, @Body() query : getPrivateMessageDto)
	{
		const target = query.target;
		return await this.messageService.getPrivateMessage(req, target);
	}



}
