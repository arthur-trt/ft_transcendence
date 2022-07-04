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

	public async sendMessageToChannel(chanIdentifier : string, sender : string, msg : string) {

		console.log("HELLO")
		const user: User = await this.userService.getUserByIdentifier(sender);
		console.log(user);
		const channel: Channel = await this.chanService.getChannelByIdentifier(chanIdentifier);
		console.log(channel);

		console.log('')
		const newMessage = await this.chatRepo.save
		(
			{
				sender: user,
				message: msg, // si j'inclus target ca va faire un pb...
			}
		)

		channel.messages = [...channel.messages, newMessage]; /* if pb of is not iterable, it is because we did not get the
		 ealtions in the find one */
		return await channel.save();
	}



	public async sendPrivateMessage(sender : string, target : string, msg : string) {

		console.log("HELLO");
		const src : User = await this.userService.getUserByIdentifier(sender);
		console.log(src);
		const dest: User = await this.userService.getUserByIdentifier(target);
		console.log(dest);

		console.log('ÏCI')
		const newMessage = await this.pmRepo.save
		(
			{
				sender: src,
				message: msg, // si j'inclus target ca va faire un pb...
			}
		)

		//src.privateMessages = [...src.privateMessages, newMessage]; /* if pb of is not iterable, it is because we did not get the */
		dest.privateMessages = [...src.privateMessages, newMessage];
		await src.save();
		return await dest.save();
	}

	public async getMessage(chanIdentifier: string)
	{
		let chan : Channel = await this.chanService.getChannelByIdentifier(chanIdentifier)
		const msgs = this.chanRepo.createQueryBuilder("chan").where("chan.name = :chanName", { chanName: chanIdentifier }).leftJoinAndSelect("chan.messages", "messages").getMany();
		return msgs;
	}


}
