import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { Request } from 'express';
import { validate as isValidUUID } from 'uuid';
import { ModifyUserDto } from 'src/dtos/user.dto';
import { UserActivity } from './user_activity.entity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(UserActivity) private userActivityRepo: Repository<UserActivity>,
		@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
		@Inject(forwardRef(() => ChannelService)) private chanService: ChannelService)
	{}

	public async getUserByRequest (req: Request) {
		const user: User = await this.getUserByIdentifier(JSON.parse(JSON.stringify(req.user)).userId);
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		return (user);
	}

	public async getTwoFASecret (req: Request)
	{
		const	user_id = JSON.parse(JSON.stringify(req.user)).userId;
		const	user = await this.userRepo.createQueryBuilder('User')
							.select(["User.TwoFA_secret"])
							.where({ "id": user_id})
							.getOne();
		if (!user)
			throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		return user.TwoFA_secret;
	}

	/**
	 * Obtain a list of all user in system
	 * @returns all user id, name and mail
	 */
	public async getUsers()
	{
		return await this.userRepo.createQueryBuilder('User')
			.select(["User.id", "User.name", "User.mail", "User.avatar_url", "User.blocked"])
			.getMany();
	}

	public async getUserByIdentifierLight(user_id: string)
	{
		//const user_id = JSON.parse(JSON.stringify(req.user)).userId;
		const user: User = await this.userRepo.createQueryBuilder('User')
			.select(["User.id", "User.name", "User.mail", "User.avatar_url"])
			.where({ id: user_id })
			.getOne();
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		return (user);
	}

	/**
	 *
	 * @param intra_id 42 intranet identifiant
	 * @returns user if found, null otherwise
	 */
	public async getUserByIntraId (intra_id: number) : Promise<User>
	{
		const user :User = await this.userRepo.findOne({
			where: {intra_id: intra_id}
		});
		return user;
	}

	public async findOrCreateUser(intra_id: number, fullname: string, username: string, avatar: string, mail: string)
	{
		let user = await this.getUserByIntraId(intra_id);
		if (user)
		{
			return (user);
		}
		else
		{
			const	new_user = {
				intra_id: intra_id,
				name: username,
				fullname: fullname,
				avatar_url: avatar,
				mail: mail
			}
			return await this.userRepo.save(new_user);
		}
	}

	/**
	 *
	 * @param uuid Uuid of the user
	 * @returns user data
	 */
	public async getUserByIdentifier(userIdentifier: string) : Promise<User> {

		let user : User = await this.userRepo.findOne({ where: { name: userIdentifier }, relations: ['channels', 'friends'] }); /* Pay attention to load relations !!! */

		if (!user && isValidUUID(userIdentifier))
			 user = await this.userRepo.findOne({
			where: {id: userIdentifier},
				 relations: ['channels', 'friends']
			});
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		return user;
	}

	/**
	 * Update user profile
	 * @param user the user we want to update
	 * @param changes containing potential modified fields : mail, name, fullname and avatar
	 * @returns the updated user
	 */
	public async updateUser(user: User, changes: ModifyUserDto) : Promise<User> {

		user.mail = changes.mail;
		user.name = changes.name;
		user.avatar_url = changes.avatar_url;
		user.fullname = changes.fullname;
		return this.userRepo.save(user);
	}

	public async setTwoFactorAuthenticationSecret (user: User, secret: string)
	{
		user.TwoFA_secret = secret;
		return this.userRepo.save(user);
	}

	public async turnOnTwoFactorAuthentication (req: Request)
	{
		const user = await this.getUserByRequest(req);
		user.TwoFA_enable = true;
		return this.userRepo.save(user);
	}


	public async joinChannel(user: User, channelname: string, password: string = null): Promise<boolean>
	{
		let channel: Channel;
		try
		{
			channel = await this.chanService.getChannelByIdentifier(channelname);
		}
		catch (err)
		{
			return await this.chanService.createChannel(channelname, user, password);
		}
		if (channel.password_protected)
		{
			if (password == null)
				return (false)
			if (!await bcrypt.compare(password, await this.chanService.getChannelPasswordHash(channel.id)))
			{
				return (false);
			}
		}
		user.channels = [...user.channels, channel]; /* if pb of is not iterable, it is because we did not get the realtions in the find one */
		await user.save();
		return (true);
	}


	public async leaveChannel(user: User, channel: string)
	{
		const chan: Channel = await this.chanService.getChannelByIdentifier(channel);

		await this.channelsRepo
			.createQueryBuilder()
			.relation(Channel, "users")
			.of(user)
			.remove(chan);

		const ownership : Channel = await this.channelsRepo.findOne({
			where: {
				owner: { id: user.id },
				name: channel
			}
		});

		if (ownership)
		{
			await this.channelsRepo
				.createQueryBuilder()
				.relation(Channel, "owner")
				.of(chan)
				.set(null);
		}

		return await this.chanService.getUsersOfChannels();
	}

	public async getChannelsForUser(user: User) :  Promise<Channel[]>
	{
		const chans : Channel[] = await this.channelsRepo.find({
			where: {
				users: { id: user.id },
			}
		});
		return chans;
	}

	public async block(user: User, toBan: User) :  Promise<User>
	{
		if (user.blocked == null)
			user.blocked = [];
		user.blocked.push(toBan.id);
		user.save();
		return user;
	}

	public async unblock(user: User, toUnBan: User): Promise<User> {
		const index = user.blocked.indexOf(toUnBan.id);
		if (index > -1) {
			user.blocked.splice(index, 1);
		}
		user.save();
		return user;
	}

	public async	setUserActive (user: User) {
		const options: UpsertOptions<UserActivity> = {
			conflictPaths: ['user'],
			skipUpdateIfNoValuesChanged: true,
		}
		await this.userActivityRepo.upsert({ user: user }, options);
	}

	public async	unsetUserActive (user: User) {
		const found : UserActivity = await this.userActivityRepo.findOneOrFail({
			where : {
				user: { id: user.id } }});
		this.userActivityRepo.delete(found.id);

	}
}


