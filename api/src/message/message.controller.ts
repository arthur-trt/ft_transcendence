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
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';


@Controller('message')
export class MessageController {

	constructor(private messageService: MessageService,
	private userService : UserService) { }

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
	@UseGuards(JwtAuthGuard)
	public async sendMessage(@Param('identifier') chanIdentifier : string, @Req() req : Request, @Body() msg : sendChannelMessageDto)
	{
		const message = msg.msg;
		const sender: User = await this.userService.getUserByRequest(req);
		return await this.messageService.sendMessageToChannel(chanIdentifier, sender, message);
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
	@UseGuards(JwtAuthGuard)
	public async getMessages(@Req() req : Request, @Param('identifier') chanIdentifier : string)
	{
		const user : User = await this.userService.getUserByRequest(req);
		const messages = await this.messageService.getMessage(chanIdentifier, user)
		return messages;
	}


	/**
	 *
	 * Get all messages from a channel FOR A PARTICULAR USER
	 *
	 * @param chanIdentifier
	 * @returns all messages from a channel
	 */

	@ApiTags('Channel messages')
	@ApiOperation({ summary: "Get all messages from a channel for a particular user" })
	@Get('channel/getMsgFromUser/:identifier')
	@UseGuards(JwtAuthGuard)
	public async getChannelMessagesOfUser(@Param('identifier') chanIdentifier : string, @Req() req : Request)
	{
		const sender: User = await this.userService.getUserByRequest(req);
		const messages = await this.messageService.getChannelMessagesOfUser(chanIdentifier, sender);
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
	@UseGuards(JwtAuthGuard)
	public async privateMessage(@Req() req : Request, @Body() message : any)
	{

		const target = message.to;

		const msg = message.msg;
		const sender = await this.userService.getUserByRequest(req);
	//	return await this.messageService.sendPrivateMessage(sender, target, msg);
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
	@UseGuards(JwtAuthGuard)
	public async getPrivateMessage(@Req() req : Request, @Body() query : getPrivateMessageDto)
	{
		const target : User = await this.userService.getUserByIdentifier(query.target);
		const user: User = await this.userService.getUserByRequest(req);
		return await this.messageService.getPrivateMessage(user, target);
	}

}
