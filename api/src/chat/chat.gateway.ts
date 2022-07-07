import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { text } from "express";
import { Server, Socket } from 'socket.io'
import { ChannelService } from "src/channel/channel.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger("Chat gateway")

	constructor(private userService: UserService) { }
	afterInit(server: Server) {
		this.logger.log('init')
	}

	async handleConnection(client: Socket, ...args: any[]) {
		client.emit('init'); // answer to client on "On"
		//performer un handshake
		// ca sera dans le header normalement sous user (req.user)

		client.data.user =
		{
			userId: 'b7274199-3a5c-4c0d-8f5b-589b005025f4',
			username: 'elisamuller'

		};

		const user : User = await this.userService.getUserByIdentifier(client.data.user.username)
		client.data.user = user;
		var util = require('util');


		this.logger.log({ handshake: client.handshake })
		this.logger.log({ request: util.inspect(client.request) })

		this.logger.log('connection !' + client.data.user)
	}

	handleDisconnect(client: Socket) {
		this.logger.log('DECONNECT !')
	}

	@SubscribeMessage('chatToServer')
	handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
		this.logger.log("Receiving msg  from " + message.sender + " to room : " + message.room)
		return this.wss.to(message.room).emit('chatToClient', message);
	}

	@SubscribeMessage('Join Room')
	handleJoinRoom(client: Socket, data : { room: string, user: string } )
	{
		this.logger.log("HANDLING " + data.user + " JOINING ROOM : " + data.room)
		//this.userService.joinChannel(client.id, room);
		client.join(data.room);
		this.logger.log(client.data);
		client.emit('Joined Room', data.room); // answer to client on "On"
	}

	@SubscribeMessage('Leave Room')
	handleLeaveRoom(client: Socket, room: string)
	{
		client.leave(room);
		client.emit('Left Room', room);
	}
}
