import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { ChannelService } from "src/channel/channel.service";
import { MessageService } from "src/message/message.service";
import { privateMessage } from "src/message/privateMessage.entity";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
@WebSocketGateway({ cors: { origin: 'https://hoppscotch.io' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


	@WebSocketServer() wss: Server;

	constructor(private userService: UserService,
		@Inject(MessageService) private messageService: MessageService,
		private channelService : ChannelService) { }

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

	@SubscribeMessage('joinRoom') /** Join ROom parce que ca le creera aussi */
	async onCreateRoom(client: Socket, channel: string) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		await this.userService.joinChannel(client.data.user, channel);
		client.join(channel);
		return this.wss.to(channel).emit('joinedRoom', client.data.user.username + " joined the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
	}

	@SubscribeMessage('privateMessage')
	async onPrivateMessage(client: Socket, msg )// : { target : string, message : string}) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		const mess = JSON.parse(msg); // Pour hacker hoppscotch ce gros nul, et avoir plusieur argumet
		this.logger.log(mess);

		// recuperer aussi le socket de l'autres
		this.wss.to(client.id).emit('messageAdded', msg); // to handle in ChatService in front
		return await this.messageService.sendPrivateMessage(client.data.user, mess.target, mess.message);
	}

	@SubscribeMessage('getPrivateMessage')
	async onGetPrivateMessage(client: Socket, user2 : string )// : { target : string, message : string}) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		return await this.messageService.getPrivateMessage(client.data.user, user2);
	}

	@SubscribeMessage('getChannelMessages')
	async onGetChannelMessages(client: Socket, channelName : string )// : { target : string, message : string}) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		return await this.messageService.getMessage(channelName);
	}

	@SubscribeMessage('message')
  	handleMessage(client: any, payload: any): string {
    	return 'Hello world!';
	}

	handleDisconnect(client: Socket) {
		client.disconnect();
		return "Goodbye";
	}


}
