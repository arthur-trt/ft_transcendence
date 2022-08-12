import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { AchievementsService } from "src/achievements/achievements.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ChatService } from "src/websocket/chat.service";
import { WSServer } from "src/websocket/wsserver.gateway";
import { dataFront, Match, Names, Scores, matchParameters } from "../game/game.interface";
import { MatchHistory } from "./game.entity";
import { GameService } from "./game.service";

@Injectable()
export class GameRelayService2 {

	constructor (
		protected readonly	userService: UserService,
		protected readonly	gameService: GameService,
		protected readonly	achivementService: AchievementsService,

		@Inject(forwardRef(() => ChatService)) protected readonly chatservice: ChatService,
		@Inject(forwardRef(() => WSServer)) protected gateway: WSServer
	) {}

	private	clientMatchmaking			= new Array<Socket> ();
	private clientMatchmakingSpecial	= new Array<Socket> ();
	// Store current match, key is the match id
	private currentMatch				= new Map<String, matchParameters> ();

	/*  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
		██░▄▀▄░█░▄▄▀█▄▄░▄▄██░▄▄▀██░██░██░▄▀▄░█░▄▄▀██░█▀▄█▄░▄██░▀██░██░▄▄░
		██░█░█░█░▀▀░███░████░█████░▄▄░██░█░█░█░▀▀░██░▄▀███░███░█░█░██░█▀▀
		██░███░█░██░███░████░▀▀▄██░██░██░███░█░██░██░██░█▀░▀██░██▄░██░▀▀▄
		▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ */

		/**
		 * Handle matchmaking. Had to corresponding array a player. When two player are waiting in the same
		 * room, they are removed from the array and game is launched.
		 * @param client User who join matchmaking queue
		 * @param mode 1 if single pallet, 2 if one pallet
		 */
		public async getInQueue(client: Socket, mode: number): Promise<void> {
			console.log(client.data.user.name + " join matchmaking");
			if (mode === 1) {
				if (this.clientMatchmaking.indexOf(client) === -1) {
					this.clientMatchmaking.push(client);
				}
				if (this.clientMatchmaking.length >= 2) {
					const [p1, p2] = this.clientMatchmaking.splice(0, 2);
					console.log(this.clientMatchmaking);
					await this.startMatch(p1, p2, false);
				}
			}
			if (mode === 2) {
				if (this.clientMatchmakingSpecial.indexOf(client) === -1) {
					this.clientMatchmakingSpecial.push(client);
				}
				if (this.clientMatchmakingSpecial.length >= 2) {
					const [p1, p2] = this.clientMatchmakingSpecial.splice(0, 2);
					await this.startMatch(p1, p2, true);
				}
			}
		}

		private	init_match(p1: User, p2: User): matchParameters {
			let	param: matchParameters;
			// Ball parameters
			if (param && param.ball) {
				param.ball.radius = 1;
				param.ball.speed = 1;
				param.ball.velocityX = .5;
				param.ball.velocityY = .5;
				param.ball.x = 100;
				param.ball.y = 50;
			}

			// Player1 paddle normal
			if (param && param.p1_paddle) {
				param.p1_paddle.x = 2;
				param.p1_paddle.y = 50;
				param.p1_paddle.height = 10;
				param.p1_paddle.width = 2;
			}

			// Player1 paddle special
			if (param && param.p1_paddle_spe) {
				param.p1_paddle_spe.x = 2;
				param.p1_paddle_spe.y = 50;
				param.p1_paddle_spe.height = 10;
				param.p1_paddle_spe.width = 2;
			}

			// Player2 paddle normal
			if (param && param.p2_paddle) {
				param.p2_paddle.x = 2;
				param.p2_paddle.y = 50;
				param.p2_paddle.height = 10;
				param.p2_paddle.width = 2;
			}

			// Player2 paddle special
			if (param && param.p2_paddle_spe)
			{
				param.p2_paddle_spe.x = 2;
				param.p2_paddle_spe.y = 50;
				param.p2_paddle_spe.height = 10;
				param.p2_paddle_spe.width = 2;
			}

			if (param && param.score)
			{
				param.score.p1 = 0;
				param.score.p2 = 0;
			}

			if (param && param.names)
			{
				param.names.p1_name = p1.name;
				param.names.p2_name = p2.name;
			}

			return param;
		}

		private async startMatch (player1: Socket, player2: Socket, specialMode: boolean) {
			const match: MatchHistory = await this.gameService.createMatch(player1.data.user, player2.data.user);
			const param: matchParameters = this.init_match(player1.data.user, player2.data.user);
			console.log(param);
			this.currentMatch.set(
				match.id,
				param
			);
			player1.join(match.id);
			player2.join(match.id);
			this.gateway.server.to(match.id).emit('set_names', param.names);
			this.gateway.server.to(match.id).emit('game_countdownStart', specialMode);
		}
	}
