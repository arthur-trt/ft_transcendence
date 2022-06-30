import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelService {

	constructor(@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
	@Inject(forwardRef(() => UserService)) private readonly userService: UserService)
	{ }


	public async createChannel(name: string, owner: string)
	{
		const chan: Channel = new Channel();
		chan.name = name;
		chan.owner = await this.userService.getUserByName(owner);
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

	public async getChannelByName(channelname : string) : Promise<Channel>
	{
		return await this.channelsRepo.findOne({ where: { name: channelname }, relations: ['messages'] });
	}
}
