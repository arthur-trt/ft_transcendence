import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { Request } from 'express';

import { newChannelDto } from 'src/dtos/newChannel.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Controller('channel')
export class ChannelController {

	constructor(private chanService: ChannelService, private userService: UserService) { }

	@Get()
	public async getChans() : Promise<Channel[]>
	{
		return await this.chanService.getUsersOfChannels();
	}

	@Post('newChannel')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	public async newChannel(@Req() req : Request, @Body() query : newChannelDto)
	{
		const chanName: string = query.chanName;
		console.log(req)
		const user: User = await this.userService.getUserByRequest(req);
		return await this.chanService.createChannel(chanName, user);
	}



}
