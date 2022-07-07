import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { Request } from 'express';

import { newChannelDto } from 'src/dtos/newChannel.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {

	constructor(private chanService: ChannelService) { }

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
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async newChannel(@Req() req : Request, @Body() query : newChannelDto)
	{
		const chanName: string = query.chanName;
		console.log(req)
		return await this.chanService.createChannel(chanName, req);
	}
}
