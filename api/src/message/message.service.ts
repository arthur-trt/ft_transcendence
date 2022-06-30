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

	public async sendMessageToChannel() {
		console.log("HELLO")
		const user: User = await this.userService.getUserByName("Arthur");
		console.log(user);
		const channel: Channel = await this.chanService.getChannelByName("Test1");
		console.log(channel);

		console.log('ÏCI')
		const newMessage = await this.chatRepo.save
		(
			{
				id: 9,
				sender: user,
				message: "Ceci est un test"
			}
		)

		channel.messages = [...channel.messages, newMessage]; /* if pb of is not iterable, it is because we did not get the
		 ealtions in the find one */
		return await channel.save();
	}

	public async getMessage(chanName: string)
	{
		const chan: Channel = await this.chanService.getChannelByName(chanName);
		const msgs = this.chanRepo.createQueryBuilder("chan").where("chan.name = :chanName", { chanName: chanName }).leftJoinAndSelect("chan.messages", "messages").getMany();
		return msgs;
	}


}
