import { ConsoleLogger, Injectable, Logger, UseGuards } from "@nestjs/common";
import { JwtVerifyOptions, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/jwt/jwt.constants";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { WsJwtAuthGuard } from "src/auth/guards/ws-auth.guard";
import { GameService } from "./game.service";
import { SocketAddress } from "net";

@Injectable()
@WebSocketGateway({ namespace: 'game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;

	constructor(
		private userService: UserService,
		private gameService: GameService,
		private readonly jwtService: JwtService
	) {}

	private logger: Logger = new Logger('GameGateway');
	private active_users = new Map<User, Socket>();

	private async	validateConnection(client: Socket) : Promise<User>
	{
		try {
			const authCookies: string[] = client.handshake.headers.cookie.split('; ');
			const authCookie: string[] = authCookies.filter(s => s.includes('Authentication='));
			const authToken = authCookie[0].substring(15, authCookie[0].length);
			const jwtOptions: JwtVerifyOptions = {
				secret: jwtConstants.secret
			}
			const jwtPayload = await this.jwtService.verify(authToken, jwtOptions);
			const user: any = await this.userService.getUserByIdentifier(jwtPayload.sub);

			return user;
		} catch (err) {
			console.log(err.message);
		}
	}

	/**
	 * Handle first connection from WebSocket. Can't use Guard on this
	 * So we validate directly on the function
	 * @param client Socket initialized by client
	 * @returns Nothing, but handle disconnection if problems occurs
	 */
	async	handleConnection(client: Socket)
	{
		const	user = await this.validateConnection(client);
		if (!user)
			return this.handleDisconnect(client);

		client.data.user = user;
		this.logger.log("New connection Game: " + user.name);
		this.active_users.set(user, client);

	}

	afterInit(server: Server) {
		console.log(server.sockets);
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getUsers')
	async getUsers(client: Socket)
	{
		this.server.to(client.id).emit('listUsers', this.gameService.listConnectedUser(client, this.active_users, false));
	}


	/**
	 * Handle Socket disconnection.
	 * @param client Socket received from client
	 */
	async handleDisconnect(client: Socket) {
		try {
			this.logger.log("User: " + client.data.user.name + " disconnected");
			this.active_users.delete(client.data.user);
		}
		catch(err) {
			console.log("Don't know what append");
		}
		client.emit('bye');
		client.disconnect(true);
	}
}
