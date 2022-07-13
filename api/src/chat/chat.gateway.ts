import { forwardRef, Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { WsJwtAuthGuard } from "src/auth/guards/ws-auth.guard";
import { ChannelService } from "src/channel/channel.service";
import { MessageService } from "src/message/message.service";
import { UserService } from "src/user/user.service";
import { JwtVerifyOptions, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/jwt/jwt.constants";
import { User } from "src/user/user.entity";
import { sendPrivateMessageDto } from "src/dtos/sendPrivateMessageDto.dto";

@Injectable()
@WebSocketGateway({ cors: { origin: 'https://hoppscotch.io' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


	@WebSocketServer() wss: Server;

	constructor(
		private userService: UserService,
		private readonly jwtService: JwtService,
		@Inject(MessageService) private messageService: MessageService,
		private channelService : ChannelService
	) { }

	private logger: Logger = new Logger("Chat gateway")
	private util = require('util');

	afterInit(server: Server) {
		this.logger.log('init')
	}

	private async	validateConnection(client: Socket) : Promise<User> {
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
	 *
	 * @param client the Socket returned by chat Service
	 */
	@UseGuards(WsJwtAuthGuard)
	async handleConnection(client: Socket)
	{
		const user = await this.validateConnection(client);
		if (!(user))
			return this.handleDisconnect(client);

		client.data.user = user;
		this.logger.log(client.data.user);
		this.logger.log('connection !' + JSON.stringify(client.data.user))
		this.wss.to(client.id).emit('rooms', "init co !", await this.channelService.getUsersOfChannels());

		const users = [];
		for (let [id, socket] of this.wss.of("/").sockets)
		{
			users.push({
				userID: id,
				username: client.data.user.name,
				photo: client.data.user.avatar_url
			})
		};
		for (let user of users)
			this.logger.log(user);

		this.wss.emit('users', "List of users", users);

	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('createRoom') /** Join ROom parce que ca le creera aussi */
	async onCreateRoom(client: Socket, channel: string) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		await this.userService.joinChannel(client.data.user, channel);
		client.join(channel);
		return this.wss.emit('rooms', client.data.user.username + " created the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('joinRoom') /** Join ROom parce que ca le creera aussi */
	async onJoinRoom(client: Socket, channel: string) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		await this.userService.joinChannel(client.data.user, channel);
		client.join(channel);
		return this.wss.emit('rooms', client.data.user.username + " joined the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
	}


	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('deleteRoom')
	async onDeletedRoom(client: Socket, channel: string)
	{
		await this.channelService.deleteChannel(client.data.user, await this.channelService.getChannelByIdentifier(channel));
		return this.wss.emit('rooms', channel + "has been deleted", await this.channelService.getUsersOfChannels()); // on emet a tt le monde que le chan a ete supp
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('leaveRoom') /** Join ROom parce que ca le creera aussi */
	async onLeaveRoom(client: Socket, channel: string) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		await this.userService.leaveChannel(client.data.user, channel);
		client.leave(channel);
		return this.wss.to(channel).emit('rooms', client.data.user.username + " left the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
	}


	/**
	 *
	 * @param client
	 * @param msg
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('privateMessage')
	async onPrivateMessage(client: Socket, msg : sendPrivateMessageDto )
	{
		this.wss.to(msg.socketId).to(client.id).emit('privateMessage', client.data.user.name + " sent a message to " + msg.username + msg.socketId, msg.msg);
		return await this.messageService.sendPrivateMessage(client.data.user, msg.username, msg.msg);
	}

	/**
	 *
	 * @param client
	 * @param user2
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getPrivateMessage')
	async onGetPrivateMessage(client: Socket, user2 : string )
	{
		const msg = await this.messageService.getPrivateMessage(client.data.user, user2);

		this.wss.to(client.id).emit('privateMessage', client.data.user.name + " get messages with " + user2, msg);
		return
	}

	/**
	 *
	 * @param client
	 * @param channelName
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getChannelMessages')
	async onGetChannelMessages(client: Socket, channelName : string )// : { target : string, message : string}) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		return await this.messageService.getMessage(channelName);
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('message')
  	handleMessage(client: any, payload: any): string {
    	return 'Hello world!';
	}


	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('test')
  	test(client: any, payload: any)
	{
    	this.logger.log("TEST OK");
	}

	handleDisconnect(client: Socket) {
		client.disconnect();
		this.logger.log("DISCONNEECT ");
		//this.wss.to(client.id).emit('connect_error'); // to handle in ChatService in front
		return "Goodbye";
	}


}
