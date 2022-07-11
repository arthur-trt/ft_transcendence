import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deepStrictEqual } from 'assert';
import { UUIDVersion } from 'class-validator';
import { Request } from 'express';
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
		@InjectRepository(User) private userRepo: Repository<User>,
		@Inject(forwardRef(() => UserService)) private readonly userService: UserService,
		@Inject(forwardRef(() => ChannelService)) private readonly chanService: ChannelService)
	{ }

	/*
	**	CHANNEL MESSAGES
	*/

	/**
	 * @brief Send a message to channel
	 * @param chanIdentifier
	 * @param sender
	 * @param msg
	 * @returns the Channel object containing its new message in its messages relationship
	 */
	public async sendMessageToChannel(chanIdentifier : string, user : User, msg : string) : Promise<Channel>
	{
		const channel : Channel = await this.chanService.getChannelByIdentifier(chanIdentifier);
		const newMessage = await this.chatRepo.save
		(
			{
				sender: user,
				message: msg,
			}
		)
		channel.messages = [...channel.messages, newMessage]; /* if pb of is not iterable, it is because we did not get the
		 ealtions in the find one */
		return await channel.save();
	}


	/**
	 * @brief get messages from a specific channel
	 * @param chanIdentifier
	 * @returns the Channel with relation to its message
	 */
	public async getMessage(chanIdentifier: string) : Promise<Channel>
	{
		let chan : Channel = await this.chanService.getChannelByIdentifier(chanIdentifier)
		const msgs = this.chanRepo.createQueryBuilder("chan").where("chan.name = :chanName", { chanName: chanIdentifier })
			.leftJoinAndSelect("chan.messages", "messages")
			.leftJoinAndSelect("messages.sender", "sender").getOne();
		return msgs;
	}

	/**
	 * @brief get messages from a specific channel
	 * @param chanIdentifier
	 * @param user the user we wanr to see messages of
	 * @returns the Channel with relation to its message
	 */
	public async 	getChannelMessagesOfUser(chanIdentifier: string, user : User) //: Promise<User>
	{
		let chan : Channel = await this.chanService.getChannelByIdentifier(chanIdentifier)
		const msgs = this.chatRepo.createQueryBuilder("msg")
			.where("msg.sender = :sendername", { sendername: user.id })
			.leftJoinAndSelect("msg.sender", "sender")
			.getMany();
			return msgs;
	}

	/*
	**	PRIVATE MESSAGES
	*/

	/**
	 * @brief send private message to a target
	 * @param req the request containing user id
	 * @param target
	 * @param msg
	 * @returns array of all private messages
	 */
	public async sendPrivateMessage(src: User, target: string, msg: string) : Promise<privateMessage[]> {

		const dest : User = await this.userService.getUserByIdentifier(target);
		const newMessage : privateMessage = await this.pmRepo.save(
		{
			sender: src.id,
			target: dest.id,
			message : msg,
		}
		)
		return await this.pmRepo.find();
	}


	/**
	 * @brief get Private messages between two users
	 * @param req the request containing user id
	 * @param target
	 * @returns private messages between two users
	 */
	public async getPrivateMessage(user1: User, target: string) : Promise<privateMessage[]>
	{
		let user2: User = await this.userService.getUserByIdentifier(target);

		const msgs = this.pmRepo.createQueryBuilder("PM")
			.leftJoinAndMapOne("PM.sender", User, 'users', 'users.id = PM.sender')
			.leftJoinAndMapOne("PM.target", User, 'usert', 'usert.id = PM.target')
			.where(new Brackets(qb => {
				qb.where("PM.sender = :dst", { dst: user1.id })
					.orWhere("PM.sender = :dst1", { dst1: user2.id })
			}))
			.andWhere(new Brackets(qb => {
				qb.where("PM.target = :dst", { dst: user1.id })
					.orWhere("PM.target = :dst1", { dst1: user2.id })
			}))
			.select(['PM.message'])
			.addSelect([
				'PM.sender',
				'PM.target',
				'PM.message',
				'users.name',
				'users.avatar_url',
				'usert.name',
				'usert.avatar_url'
			  ])
			.getMany();
		return msgs;
	}
}
