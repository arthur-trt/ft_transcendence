import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(Channel) private channelsRepo: Repository<Channel>) {
	}

	public defaultRoot()
	{
		return ("Super");
	}


	public async getUsers()
	{
		return await this.userRepo.createQueryBuilder('User')
		.leftJoinAndSelect("User.channels", "Channel")
		.getMany();
	}

	public async createUser(user: UserDto)
	{
		return await this.userRepo.save(user);
	}

	public async getUsersOfChannels()
	{
		return await this.channelsRepo.createQueryBuilder('Channel')
		.leftJoinAndSelect("Channel.users", "Users")
		.getMany();
	}

	public async joinChannel(username: string, channelname: string)
	{
		// const user = await this.userRepo.createQueryBuilder('User')
		// 	.relation(User, "channels")
		// 	.of({ username: username })
		// 	//.where("User.name = :username", { username: username })
		// 	//.getOne();
		// 	.loadOne();// adresse mail aparait pas avec cette syntaxe

		const user = await this.userRepo.findOne({ where: { name: username }, relations : ['channels'] }); /* Pay attention to load relations !!! */
			console.log(user);


		const channel = await this.channelsRepo.createQueryBuilder("Channel")
			.where("Channel.name = :channelname", { channelname: channelname })
			.getOne();

		console.log(channel);
		user.channels = [...user.channels, channel]; /* if pb of is not iterable, it is because we did not get the realtions in the find one */
		//user.channels.push(channel);
		return await user.save();
	}
}
