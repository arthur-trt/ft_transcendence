import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { newChannelDto } from 'src/dtos/newChannel.dto';

@Controller('channel')
export class ChannelController {

	constructor(private chanService: ChannelService) { }

	@Get()
	public async getChans() : Promise<Channel[]>
	{
		return await this.chanService.getUsersOfChannels();
	}

	@Post('newChannel') /** channel=lol,user=toto */
	@UsePipes(ValidationPipe)
	public async newChannel(@Body() query : newChannelDto)
	{
		const chanName: string = query.chanName;
		const creator: string = query.userIdentifier;
		return await this.chanService.createChannel(chanName, creator);
	}



}
