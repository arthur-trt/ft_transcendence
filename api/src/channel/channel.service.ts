import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUIDVersion } from 'class-validator';
import { channel } from 'diagnostics_channel';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { validate as isValidUUID } from 'uuid';
import { Request } from 'express';


@Injectable()
export class ChannelService {

	constructor(@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
	@Inject(forwardRef(() => UserService)) private readonly userService: UserService)
	{ }

	/**
	 * @brief Create channel
	 * @param name the name of the channel
	 * @param req the request containing user id
	 * @returns
	 */
	public async createChannel(name: string, @Req() req : Request)
	{
		const chan: Channel = new Channel();
		chan.name = name;
		chan.owner = await this.userService.getUserByRequest(req);
		await this.channelsRepo.save(chan);
		return await this.userService.joinChannel(req, name);
	}

	/**
	 * @brief Returns all users of all existing channels
	 * @returns
	 */
	public async getUsersOfChannels() : Promise<Channel[]>
	{
		return await this.channelsRepo.createQueryBuilder('Channel')
			.leftJoinAndSelect("Channel.users", "Users")
			.leftJoinAndSelect("Channel.owner", "o")
		.getMany();
	}

	/**
	 * @brief Find a channel by its name or its id
	 * @param channelIdentifier (id or name)
	 * @returns Channel object corresponding
	 */
	public async getChannelByIdentifier(channelIdentifier : string) : Promise<Channel>
	{
		let chan : Channel = await this.channelsRepo.findOne({ where: { name: channelIdentifier }, relations: ['messages'] });
		if (!chan && isValidUUID(channelIdentifier))
			await this.channelsRepo.findOne({ where: { id: channelIdentifier }, relations: ['messages'] });
		if (!chan)
			throw new HttpException('Channel not found (id or name)', HttpStatus.NOT_FOUND);
		return chan;
	}
}
