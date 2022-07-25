import { ConsoleLogger, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMatchDto, endMatchDto } from 'src/dtos/match.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Brackets, Repository } from 'typeorm';
import { MatchHistory } from './game.entity';
import { Socket, Server } from 'socket.io'


@Injectable()
export class GameService {

	constructor(
		@InjectRepository(MatchHistory) private MatchRepo: Repository<MatchHistory>,
		@InjectRepository(User) private UserRepo: Repository<User>,
		private userService: UserService
	) { }

	/**
	 *
	 * 
	 * @returns All the matches with details (joining users tab)
	 */
	async getCompleteMatchHistory(): Promise<MatchHistory[]> {
		return this.MatchRepo.createQueryBuilder("Match")
			.leftJoinAndMapOne("Match.user1", User, 'users', 'users.id = Match.user1')
			.leftJoinAndMapOne("Match.user2", User, 'usert', 'usert.id = Match.user2')
			.select(['Match.id', 'Match.startTime', 'Match.stopTime', 'Match.scoreUser1', 'Match.scoreUser2', 'Match.finished'])
			.addSelect([
				"users.name",
				"users.avatar_url",
				"users.wonMatches",
				"usert.name",
				"usert.avatar_url",
				"usert.wonMatches"
			])
			.getMany();
	}

	async createMatch(user1: User, user2: User) {//Promise<MatchHistory> {
		const newMatch: MatchHistory = await this.MatchRepo.save(
			{
				user1: user1.id,
				user2: user2.id
			});
		await this.MatchRepo.save(newMatch);
		return newMatch; /* Comme ca le front peut stock l'id ? */
	}

	/**
	 * At the end of match, we can now add :
	 * - stop Time
	 * - ScoreUser1
	 * - ScoreUser2
	 * @param match
	 * @returns
	 */
	async endMatch(match: endMatchDto): Promise<any> // en vrai c'est MatchHistory[]
	{
		const endedMatch: MatchHistory = await this.findMatchById(match.id);
		if (!endedMatch)
			throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
		if (endedMatch.finished == true)
			return ({ "msg": "Match is already finished man!", "match": endedMatch });
		endedMatch.scoreUser1 = match.scoreUser1;
		endedMatch.scoreUser2 = match.scoreUser2;
		endedMatch.stopTime = new Date();
		endedMatch.finished = true;
		const winner: User = match.scoreUser1 > match.scoreUser2 ? await this.userService.getUserByIdentifier(endedMatch.user1) : await this.userService.getUserByIdentifier(endedMatch.user2);
		winner.wonMatches += 1;
		await this.UserRepo.save(winner);
		await this.MatchRepo.save(endedMatch);
		return await this.getCompleteMatchHistory();
	}

	async findMatchById(matchId: string) {
		const match: MatchHistory = await this.MatchRepo.findOne({
			where: { id: matchId }
		});
		return match;
	}

	/**
	 * Return a JSON object with all active user. With or without the user who made the request
	 * regardind of `withCurrentUser` parameters
	 * @param client user who made the request
	 * @param active_user map of active user
	 * @param withCurrentUser if true user who made the request will be included
	 * @returns
	 */
	listConnectedUser(client: Socket, active_user: Map<User, Socket>, withCurrentUser: boolean = true) {
		let data	= [];
		let i		= 0;

		for (let user of active_user.keys()) {
			if (client.data.user.id == user.id && withCurrentUser) {
				data[i] = user;
				i++;
			}
			else if (client.data.user.id != user.id) {
				data[i] = user;
				i++;
			}
		}
		return (data);
	}

}
