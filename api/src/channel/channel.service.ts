import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUIDVersion } from 'class-validator';
import { channel } from 'diagnostics_channel';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { validate as isValidUUID } from 'uuid';


@Injectable()
export class ChannelService {

	constructor(@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
	@Inject(forwardRef(() => UserService)) private readonly userService: UserService)
	{ }


	public async createChannel(name: string, owner: string)
	{
		const chan: Channel = new Channel();
		chan.name = name;
		chan.owner = await this.userService.getUserByIdentifier(owner);
		console.log(chan.owner)
		await this.channelsRepo.save(chan);
		return await this.userService.joinChannel(owner, name);;
	}

	public async getUsersOfChannels() : Promise<Channel[]>
	{
		return await this.channelsRepo.createQueryBuilder('Channel')
			.leftJoinAndSelect("Channel.users", "Users")
			.leftJoinAndSelect("Channel.owner", "o")
		.getMany();
	}


	/** Identifier = id ou  */
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
