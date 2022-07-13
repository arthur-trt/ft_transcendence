import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { Request } from 'express';
import { validate as isValidUUID } from 'uuid';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ModifyUserDto } from 'src/dtos/user.dto';


@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
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
			.select(["User.id", "User.name", "User.mail", "User.avatar_url"])
			.getMany();
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

		let user : User = await this.userRepo.findOne({ where: { name: userIdentifier }, relations: ['channels'] }); /* Pay attention to load relations !!! */

		if (!user && isValidUUID(userIdentifier))
			 user = await this.userRepo.findOne({
			where: {id: userIdentifier},
			relations: ['channels']
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


	public async joinChannel(user: User, channelname: string)
	{
		let channel: Channel;
		try
		{
			channel = await this.chanService.getChannelByIdentifier(channelname);
		}
		catch (err)
		{
			return await this.chanService.createChannel(channelname, user);
		}
		user.channels = [...user.channels, channel]; /* if pb of is not iterable, it is because we did not get the realtions in the find one */
		return await user.save();
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
}


