import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { Request } from 'express';

import { newChannelDto } from 'src/dtos/newChannel.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {

	constructor(private chanService: ChannelService, private userService: UserService) { }

	/**
	 * Get all users of all channels.
	 * @returns
	 */

	@Get()
	@ApiOperation({ summary: "Get all users of all channels" })
	public async getChans() : Promise<Channel[]>
	{
		return await this.chanService.getUsersOfChannels();
	}

	/**
	 * Create a new channel specifying channel name from a user.
	 * The requesting user will own the channel.
	 *
	 * @param req containing id user that will be
	 * @param query
	 * @returns
	 */

	@Post('new')
	@ApiOperation({ summary: "Create a new Channel" })
	@UseGuards(JwtAuthGuard)
	public async newChannel(@Req() req : Request, @Body() query : newChannelDto)
	{
		const chanName: string = query.chanName;
		const user: User = await this.userService.getUserByRequest(req);
		return await this.chanService.createChannel(chanName, user);
	}
}
