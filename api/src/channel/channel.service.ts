import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ModifyChannelDto } from 'src/dtos/modifyChannel.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { DefaultSerializer } from 'v8';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelService {

	constructor(@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
	@Inject(forwardRef(() => UserService)) private readonly userService: UserService)
	{ }

	public async isInChan(chan: Channel, user: User) : Promise<boolean>
	{
		const foundChan : Channel = await this.channelsRepo.findOne({
			where : { name : chan.name, users : { id : user.id } }
		})
		if (foundChan != null)
			return true;
		return false;
	}


	/**
	 * @brief Create channel
	 * @param name the name of the channel
	 * @param req the request containing user id
	 * @returns
	 */
	public async createChannel(name: string, user: User, password: string = null, privacy : boolean = false)
	{
		const chan: Channel = new Channel();
		chan.name = name;
		chan.owner = user;
		chan.admins = [];
		chan.muted = [];
		chan.banned = [];
		chan.admins = [...chan.admins, user];
		chan.private = privacy;
		if (password)
		{
			chan.password_protected = true;
			chan.password = await bcrypt.hash(password, 10);
		}
		await this.channelsRepo.save(chan)
		await this.userService.joinChannel(user, name, password);

	}

	public async setNewAdmin(user: User, channel : Channel, toBeAdmin: User)
	{
		if (!await this.isInChan(channel, toBeAdmin))
			throw new HttpException("User " + toBeAdmin.name + " is not in channel", HttpStatus.FORBIDDEN);
		if (!channel.adminsId.includes(user.id))
			throw new HttpException("You must be admin to name another admin.", HttpStatus.FORBIDDEN);
		channel.admins = [...channel.admins, toBeAdmin];
		channel.adminsId = [...channel.adminsId, toBeAdmin.id]
		await this.channelsRepo.save(channel);
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
	 * @brief Returns all users of all existing channels
	 * @returns
	 */
	public async getChannelsForUser(user : User) : Promise<Channel[]>
	{
		return await this.channelsRepo.createQueryBuilder('channel')
			.orderBy("channel.name")
			.leftJoinAndSelect("channel.users", "Users")
			.leftJoinAndSelect("channel.banned", "b")
			.leftJoinAndSelect("channel.owner", "o")
			.leftJoinAndSelect("channel.admins", "a")
			.where('channel.private = false')
			.orWhere("Users.id = :id", { id: user.id })
			.getMany();
	}

	/**
	 * @brief Find a channel by its name or its id
	 * @param channelIdentifier (id or name)
	 * @returns Channel object corresponding
	 */
	public async getChannelByIdentifier(channelIdentifier : string) : Promise<Channel>
	{
		const chan : Channel = await this.channelsRepo.findOne({ where: { name: channelIdentifier }, relations: ['messages', 'banned', 'admins', 'muted'] });
		if (!chan && isValidUUID(channelIdentifier))
			await this.channelsRepo.findOne({ where: { id: channelIdentifier }, relations: ['messages', 'banned', 'admins', 'muted'] })
		if (!chan)
			throw new HttpException('Channel ' + channelIdentifier + ' not found (id or name)', HttpStatus.NOT_FOUND);
		return chan;
	}

	async	getChannelPasswordHash(channelId: string): Promise<string> {
		const chan: Channel = await this.channelsRepo.createQueryBuilder('Channel')
			.select(["Channel.password"])
			.where({ "id": channelId })
			.getOne();
		return chan.password;
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
		if (chan.ownerId != user.id)
			throw new HttpException("You must be owner to change chan settings.", HttpStatus.FORBIDDEN);
		if (changes.password)
		{
			chan.password_protected = true;
			chan.password = await bcrypt.hash(changes.password, 10);
		}
		else
		{
			chan.password_protected = false;
		}
		return await this.channelsRepo.save(chan);
	}


	/**
 	* @brief deleteChannel -- performed by owner
	* @param user User requesting changes
 	* @param changes changes to be performed - chanName or ownership
 	* @returns All channels after deletion
 	*/

	 public async deleteChannel(user: User, channel: Channel)// : Promise<Channel[]>
	 {
		if (!channel.adminsId.includes(user.id))
			throw new HttpException("You must be admin to delete chan.", HttpStatus.FORBIDDEN);
		await this.channelsRepo
    		.createQueryBuilder()
    		.delete()
    		.from(Channel)
    		.where("name = :channame", { channame: channel.name })
			.execute();
	}


	/**
 	*
 	* @param user
 	* @param toBan
 	* @returns
 	*/
	public async deleteUserFromChannel(user: User, channel : Channel, toBan: User) //: Promise<Channel[]>
	{
		if (!channel.adminsId.includes(user.id))
			throw new HttpException("You must be admin to delete an user from chan.", HttpStatus.FORBIDDEN);
		if (!await this.isInChan(channel, user))
			throw new HttpException("User " + toBan.name + " is not in channel", HttpStatus.FORBIDDEN);

		await this.channelsRepo.createQueryBuilder()
			.relation(Channel, "users")
			.of({ id: toBan.id })
			.remove({ id: channel.id });
	}

	public async unban(channel: Channel, toUnBan: User)
	{
		console.log("Un Ban")
		channel.banned = channel.banned.filter((banned) => {
			return banned.id !== toUnBan.id
		})
		await channel.save();
	}

	public async unmute(channel: Channel, toUnMute: User)
	{
		console.log("Un Mute")
		channel.muted = channel.muted.filter((muted) => {
			return muted.id !== toUnMute.id
		})
		await channel.save();
		console.log("Muted" + channel.muted)
		console.log( "Id " + channel.mutedId)
	}

	public async temporaryBanUser(user: User, channel: Channel, toBan: User)
	{
		if (!channel.adminsId.includes(user.id))
			throw new HttpException("You must be admin to ban an user from chan.", HttpStatus.FORBIDDEN);
		if (channel.bannedId.includes(toBan.id))
			throw new HttpException("This user is already banned.", HttpStatus.FORBIDDEN);
		console.log("Bannishement");
		/** Step one : Deleting user from channel */
		await this.deleteUserFromChannel(user, channel, toBan);
		/** Step two : add it to ban list  */
		console.log(channel.banned);
		channel.banned = [...channel.banned, toBan];
		console.log(channel.banned);
		await channel.save();
		/** Step three : set timeout to remove from ban list */
		setTimeout(() => { this.unban(channel, toBan)}, 30000);
	}


	public async temporaryMuteUser(user: User, channel: Channel, toMute: User)
	{
		if (!await this.isInChan(channel, toMute))
			throw new HttpException("User " + toMute.name + " is not in channel", HttpStatus.FORBIDDEN);
		if (!channel.adminsId.includes(user.id))
			throw new HttpException("You must be admin to mute an user from chan.", HttpStatus.FORBIDDEN);
		console.log("Mute");
		channel.muted = [...channel.muted, toMute];
		await channel.save();
		console.log("Muted" + channel.muted)
		console.log( "Id " + channel.mutedId)
		setTimeout(() => { this.unmute(channel, toMute)}, 30000);
	}
}
