import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { MessageDto } from 'src/dtos/message.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { channelMessage } from './channelMessage.entity';
import { privateMessage } from './privateMessage.entity';

@Injectable()
export class MessageService {

	constructor(@InjectRepository(privateMessage) private pmRepo: Repository<privateMessage>,
		@InjectRepository(channelMessage) private chatRepo: Repository<channelMessage>,
		@InjectRepository(Channel) private chanRepo: Repository<Channel>,
		@Inject(forwardRef(() => UserService)) private readonly userService: UserService,
		@Inject(forwardRef(() => ChannelService)) private readonly chanService: ChannelService)
	{ }

	public async sendMessageToChannel()
	{
		const user: User = await this.userService.getUserByName("Arthur");
		const channel: Channel = await this.chanService.getChannelByName("Test1");
		const message : channelMessage =
		{
			id : 9,
			sender : user,
			target : channel,
			message: "Ceci est un test"
		}

		channel.messages = [...channel.messages, message]; /* if pb of is not iterable, it is because we did not get the realtions in the find one */
		await channel.save();
		return "lol";
	}

	public async getMessage(chanName: string)
	{
		const chan: Channel = await this.chanService.getChannelByName(chanName);
		const msgs = await this.chanRepo.find({ where: { id: chan.id }, relations: ['messages']});
		return msgs;
	}


}
