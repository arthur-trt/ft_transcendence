import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUIDVersion } from 'class-validator';
import { channel } from 'diagnostics_channel';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { getRepository, Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { validate as isValidUUID } from 'uuid';
import { Request } from 'express';
import { ModifyChannelDto } from 'src/dtos/modifyChannel.dto';


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
	public async createChannel(name: string, user : User)
	{
		const chan: Channel = new Channel();
		chan.name = name;
		chan.owner = user;
		await this.channelsRepo.save(chan);
		return await this.userService.joinChannel(user, name);
	}

	/**
	 * @brief Returns all users of all existing channels
	 * @returns
	 */
	public async getUsersOfChannels() : Promise<Channel[]>
	{
		return await this.channelsRepo.createQueryBuilder('Channel')
			.orderBy("Channel.name")
			.leftJoinAndSelect("Channel.users", "Users")
			.leftJoinAndSelect("Channel.banned", "b")
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
		let chan : Channel = await this.channelsRepo.findOne({ where: { name: channelIdentifier }, relations: ['messages', 'banned'] });
		if (!chan && isValidUUID(channelIdentifier))
			await this.channelsRepo.findOne({ where: { id: channelIdentifier }, relations: ['messages', 'banned'] });
		if (!chan)
			throw new HttpException('Channel not found (id or name)', HttpStatus.NOT_FOUND);
		return chan;
	}

	/**
 	* @brief updateChannelSettings -- can only be performed by owner.
	* @param user User requesting changes
 	* @param changes changes to be performed - chanName or ownership
 	* @returns Repository modified
 	*/
	public async updateChannelSettings(user: User, changes: ModifyChannelDto) : Promise<Channel>
	{
		const chan: Channel = await this.getChannelByIdentifier(changes.chanName);
		chan.name = changes.chanName;
		chan.owner = changes.owner;
		return this.channelsRepo.save(chan);
	}


	/**
 	* @brief deleteChannel -- performed by owner
	* @param user User requesting changes
 	* @param changes changes to be performed - chanName or ownership
 	* @returns All channels after deletion
 	*/
	 public async deleteChannel(user: User, channel: Channel) : Promise<Channel[]>
	 {
		await this.channelsRepo
    		.createQueryBuilder()
    		.delete()
    		.from(Channel)
    		.where("name = :channame", { channame: channel.name })
			.execute();
		 return await this.getUsersOfChannels();
	}


	/**
 	*
 	* @param user
 	* @param toBan
 	* @returns
 	*/
	public async deleteUserFromChannel(user: User, channel : Channel, toBan: User) : Promise<Channel[]>
	{
		await this.channelsRepo.createQueryBuilder()
			.relation(Channel, "users")
			.of({ id: toBan.id })
			.remove({ id: channel.id });
		return this.getUsersOfChannels();
	}

	public async unban(channel: Channel, toUnBan: User)
	{
		channel.banned = channel.banned.filter((banned) => {
			return banned.id !== toUnBan.id
		})
		channel.save();
		return channel;
	}

	public async temporaryBanUser(user: User, channel: Channel, toBan: User)
	{
		console.log("Bannishement");
		/** Step one : Deleting user from channel */
		await this.deleteUserFromChannel(user, channel, toBan);
		/** Step two : add it to ban list  */
		console.log(channel.banned);
		channel.banned = [...channel.banned, toBan];
		await channel.save();
		/** Step three : set timeout to remove from ban list */
		setTimeout(() => { this.unban(channel, toBan)}, 30000);
		return channel;
	}



}
