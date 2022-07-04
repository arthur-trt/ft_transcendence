import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { MessageDto } from 'src/dtos/message.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Brackets, Repository } from 'typeorm';
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





	public async getMessage(chanIdentifier: string)
	{
		let chan : Channel = await this.chanService.getChannelByIdentifier(chanIdentifier)
		const msgs = this.chanRepo.createQueryBuilder("chan").where("chan.name = :chanName", { chanName: chanIdentifier }).leftJoinAndSelect("chan.messages", "messages").getMany();
		return msgs;
	}


	/* Private */
	public async sendPrivateMessage(sender: string, target: string, msg: string) {

		console.log("HELLO");
		const src: User = await this.userService.getUserByIdentifier(sender);
		console.log(src);
		const dest: User = await this.userService.getUserByIdentifier(target);
		console.log(dest);

		const newMessage: privateMessage = await this.pmRepo.save(
		{
			sender: src.id,
			target: dest.id,
			message : msg,

		}
		)
		return await this.pmRepo.find();
	}

	public async getPrivateMessage(sender: string, target: string)
	{
		let user1: User = await this.userService.getUserByIdentifier(sender);
		let user2: User = await this.userService.getUserByIdentifier(target);

		const msgs = this.pmRepo.createQueryBuilder("PM")
			.where(new Brackets(qb => {
        		qb.where("PM.sender = :dst", { dst: user1.id })
          		.orWhere("PM.sender = :dst1", { dst1: user2.id })
    		}))
			.andWhere(new Brackets(qb => {
        		qb.where("PM.target = :dst", { dst: user1.id })
          		.orWhere("PM.target = :dst1", { dst1: user2.id })
			}))
			.getMany();
		return msgs;
	}


}
