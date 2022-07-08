import { Injectable, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
@WebSocketGateway({ cors : { origin: 'https://hoppscotch.io'}})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect  {


	@WebSocketServer() wss: Server;

	constructor(private userService: UserService) { }

	private logger: Logger = new Logger("Chat gateway")
	private util = require('util');

	afterInit(server: Server) {
		this.logger.log('init')
	}

	/**
	 *
	 * @param client the Socket returned by chat Service
	 */
	async handleConnection(client: Socket) {

		/**
		 * Cheat way of connection waiting for header implementation
		 * We just store the first user of db
		 */
		const users: User[] = await this.userService.getUsers();
		const good: User = await this.userService.getUserByIdentifier(users[0].id);
		if (!good)
			return this.handleDisconnect(client);
		client.data.user = good;




		this.logger.log({ handshake: client.handshake })
		this.logger.log({ request: this.util.inspect(client.request) })

		this.logger.log('connection !' + JSON.stringify(client.data.user))
		client.emit('init');
	}

	@SubscribeMessage('message')
  	handleMessage(client: any, payload: any): string {
    	return 'Hello world!';
	}

	handleDisconnect(client: Socket) {
		client.disconnect();
	}


}
