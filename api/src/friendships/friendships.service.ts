import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Friendships } from './frienship.entity';

@Injectable()
export class FriendshipsService {

	constructor(@InjectRepository(Friendships) private friendRepo: Repository<Friendships>) { }

	public async sendFriendRequest(sender: User, target: User)
	{
		return await this.friendRepo.save({
			sender: sender.id,
			target: target.id,
			status: "pending"
		});
	}

	public async acceptFriendRequest(user1: User, user2: User) : Promise<Friendships>
	{
		const friendship = await this.friendRepo
			.createQueryBuilder('friend')
			.leftJoinAndMapOne("friend.sender", User, 'users', 'users.id = friend.sender')
			.leftJoinAndMapOne("friend.target", User, 'usert', 'usert.id = friend.target')
			.where(new Brackets(qb => {
				qb.where("friend.sender = :sender", { sender: user1.id })
					.orWhere("friend.sender = :sender2", { sender2: user2.id })
			}))
			.andWhere(new Brackets(qb => {
				qb.where("friend.target = :dst", { dst: user1.id })
					.orWhere("friend.target = :dst1", { dst1: user2.id })
			}))
			.getOne();

		friendship.status = "accepted";
		return await this.friendRepo.save(friendship);
	}

	public async getFriendsRequests(user : User) : Promise<Friendships[]>
	{
		return await this.friendRepo
		.createQueryBuilder('friend')
		.leftJoinAndMapOne("friend.sender", User, 'users', 'users.id = friend.sender')
		.leftJoinAndMapOne("friend.target", User, 'usert', 'usert.id = friend.target')
		.where("friend.target = :target", { target: user.id })
		.andWhere("friend.status = :ok", { ok: "pending" })
		.select(['friend.sender'])
		.addSelect([
			'friend.target',
			'friend.status',
			'users.name',
			'users.avatar_url',
			'usert.name',
			'usert.avatar_url'
		  ])
		.getMany();
	}

	public async getFriendsofUsers(user: User) : Promise<Friendships[]>
	{
		return await this.friendRepo
			.createQueryBuilder('friend')
			.leftJoinAndMapOne("friend.sender", User, 'users', 'users.id = friend.sender')
			.leftJoinAndMapOne("friend.target", User, 'usert', 'usert.id = friend.target')
			.where(new Brackets(qb => {
				qb.where("friend.sender = :sender", { sender: user.id })
					.orWhere("friend.target = :sender2", { sender2: user.id })
			}))
			.andWhere("friend.status = :ok", { ok: "accepted" })
			.select(['friend.sender'])
			.addSelect([
				'friend.target',
				'friend.status',
				'users.name',
				'users.avatar_url',
				'usert.name',
				'usert.avatar_url'
			  ])
			.getMany();

	}

	async removeFriend(user1 : User, user2 : User)
	{
		return await this.friendRepo.createQueryBuilder('friend')
			.delete()
			.from(Friendships)
			.where(new Brackets(qb => {
				qb.where("friend.sender = :sender", { sender: user1.id })
					.orWhere("friend.sender = :sender2", { sender2: user2.id })
			}))
			.andWhere(new Brackets(qb => {
				qb.where("friend.target = :dst", { dst: user1.id })
					.orWhere("friend.target = :dst1", { dst1: user2.id })
			}))
			.execute();
	}
}
