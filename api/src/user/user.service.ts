import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { userInfo } from 'os';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(Channel) private channelsRepo: Repository<Channel>,
		@Inject(forwardRef(() => ChannelService)) private chanService: ChannelService)
	{}


	public async getUsers()
	{
		return await this.userRepo.createQueryBuilder('User')
			.leftJoinAndSelect("User.channels", "Channel")
			.leftJoinAndSelect("Channel.owner", "o")
			.getMany();
	}

	public async createUser(user: UserDto)
	{
		return await this.userRepo.save(user);
	}

	public async getUserByName(name: string) : Promise<User> {

		const user = await this.userRepo.findOne({ where: { name: name }, relations: ['channels'] }); /* Pay attention to load relations !!! */
		console.log ( "FOUND USER "  + user)
		return user;
	}

	public async joinChannel(username: string, channelname: string)
	{
		// const user = await this.userRepo.createQueryBuilder('User')
		// 	.relation(User, "channels")
		// 	.of({ username: username })
		// 	//.where("User.name = :username", { username: username })
		// 	//.getOne();
		// 	.loadOne();// adresse mail aparait pas avec cette syntaxe

		console.log ("Username : " + username)
		const user = await this.userRepo.findOne({ where: { name: username }, relations : ['channels'] }); /* Pay attention to load relations !!! */
		if (!user) {
			throw new HttpException('User Not Found in JoinChannel', 404);
		}
		console.log("USER :" + user);
		const channel = await this.chanService.getChannelByName(channelname);

		if (!channel)
		{
			return this.chanService.createChannel(channelname, username);
		}
		console.log("CHANNEL :" + channel);
		user.channels = [...user.channels, channel]; /* if pb of is not iterable, it is because we did not get the realtions in the find one */
		return await user.save();
	}
}


