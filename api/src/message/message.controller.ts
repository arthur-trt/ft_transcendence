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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('message')
export class MessageController {

	constructor(private messageService: MessageService) { }

	/*
	** CHANNEL
	*/

	/**
	 *	Send a message to a specific channel.
	 *
	 * @param chanIdentifier
	 * @param req
	 * @param message
	 * @returns the Channel object containing its new message in its messages relationship
	 */

	@ApiTags('Channel messages')
	@ApiOperation({ summary: "Send a message to a channel" })
	@Post('channel/sendMsg/:identifier')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async sendMessage(@Param('identifier') chanIdentifier : string, @Req() req : Request, @Body() msg : sendChannelMessageDto)
	{
		const message = msg.msg;
		return await this.messageService.sendMessageToChannel(chanIdentifier, req, message);
	}

	/**
	 *
	 * Get all messages from a channel
	 *
	 * @param chanIdentifier
	 * @returns all messages from a channel
	 */

	@ApiTags('Channel messages')
	@ApiOperation({ summary: "Get all messages from a channel" })
	@Get('channel/getMsg/:identifier')
	public async getMessages(@Param('identifier') chanIdentifier : string)
	{
		const messages = await this.messageService.getMessage(chanIdentifier)
		return messages;
	}

	/*
	** PRIVATE
	*/

	/**
	 * Send a private message from connected user to another user.
	 *
	 * @param req Request containing user id
	 * @param message containing target and message
	 * @returns array of all private messages
	 */

	@ApiTags('Private Messages')
	@Post('privateMessage/sendMsg')
	@ApiOperation({ summary: "Send private message to another user" })
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async privateMessage(@Req() req : Request, @Body() message : sendPrivateMessageDto)
	{
		const target = message.target;
		const msg = message.msg;
		return await this.messageService.sendPrivateMessage(req, target, msg);
	}

	/**
	 *	Get private messages between connected users and another user.
	 *
	 * @param req
	 * @param query
	 * @returns
	 */

	@ApiTags('Private Messages')
	@Get('privateMessage/')
	@ApiOperation({ summary: "Get private messages between two users" })
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async getPrivateMessage(@Req() req : Request, @Body() query : getPrivateMessageDto)
	{
		const target = query.target;
		return await this.messageService.getPrivateMessage(req, target);
	}

}
