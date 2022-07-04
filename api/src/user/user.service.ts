import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { v4 as uuidv4 } from 'uuid';
import { userInfo } from 'os';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
		@Inject(forwardRef(() => ChannelService)) private chanService: ChannelService)
	{}


	/**
	 * Obtain a list of all user in system
	 * @returns all user id, name and mail
	 */
	public async getUsers()
	{
		return await this.userRepo.createQueryBuilder('User')
			.select(["User.id", "User.name", "User.mail"])
			.getMany();
	}

	public async createUser(user: UserDto)
	{
		return await this.userRepo.save(user);
	}


	/**
	 *
	 * @param uuid Uuid of the user
	 * @returns user data
	 */

	public async getUserByIdentifier(uuid: string) : Promise<User> {
		let user = await this.userRepo.findOne({
			where: {id: uuid},
			relations: ['channels', 'privateMessages']
		});
		if (!user)
		 	user = await this.userRepo.findOne({ where: { name: uuid }, relations: ['channels', 'privateMessages'] }); /* Pay attention to load relations !!! */
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		return user;
	}

	public async updateUserPhoto(uuid: string, mail: string) : Promise<User> {

		const user = await this.userRepo.findOne({
			where: {id: uuid},
			relations: ['channels']
		});
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		user.mail = mail;
		this.userRepo.save(user);
		return user;
	}

	public async joinChannel(username: string, channelname: string)
	{
		console.log ("Username : " + username)
		const user = await this.userRepo.findOne({ where: { name: username }, relations : ['channels'] }); /* Pay attention to load relations !!! */
		if (!user) {
			throw new HttpException('User Not Found in JoinChannel', 404);
		}
		console.log("USER :" + user);
		const channel = await this.chanService.getChannelByIdentifier(channelname);

		if (!channel)
		{
			return this.chanService.createChannel(channelname, username);
		}
		console.log("CHANNEL :" + channel);
		user.channels = [...user.channels, channel]; /* if pb of is not iterable, it is because we did not get the realtions in the find one */
		return await user.save();
	}
}


