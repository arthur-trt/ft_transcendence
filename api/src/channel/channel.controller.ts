import { Controller, Get, Post, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';

@Controller('channel')
export class ChannelController {

	constructor(private chanService: ChannelService) { }

	@Get()
	public async getChans() : Promise<Channel[]>
	{
		return await this.chanService.getUsersOfChannels();
	}

	@Post('newChannel') /** channel=lol,user=toto */
	public async newChannel(@Query() query)
	{
		const chanName: string = query.channel;
		const creator: string = query.user;
		return await this.chanService.createChannel(chanName, creator);
	}



}
