import { Injectable, Logger, Req, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Request, text } from "express";
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChannelService } from "src/channel/channel.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({ cors: { origin: 'https://hoppscotch.io' } })//, namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger("Chat gateway")

	constructor(private userService: UserService, private jwtService: JwtService) { }
	afterInit(server: Server) {
		this.logger.log('init')
	}



	async handleConnection(client: Socket, ...args: any[]) {
		// answer to client on "On"
		//performer un handshake
		// ca sera dans le header normalement sous user (req.user)
		//const decodedToken = await this.verifyJwt(client.handshake.headers.authorization);
		//onst user: UserI = await this.userService.getOne(decodedToken.user.id);
		//console.log(decodedToken);
		client.data.user =
		{
			userId: 'f2672880-47c8-480f-b1f5-ce7ba51793f2',
			username: 'wisozkanais'

		};

		try {
			const user: User = await this.userService.getUserByIdentifier(client.data.user.userId)
			client.data.user = user;
		}
		catch (err) {
			const users: User[] = await this.userService.getUsers();
			const good: User = await this.userService.getUserByIdentifier(users[0].id);
			client.data.user = good;
			//return ("Hello World ! ")
		}
		var util = require('util');


		this.logger.log({ handshake: client.handshake })
		this.logger.log({ request: util.inspect(client.request) })

		this.logger.log('connection !' + JSON.stringify(client.data.user))
		client.emit('init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log('DECONNECT !')
	}

	@SubscribeMessage('chatToServer')
	handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
		this.logger.log(JSON.stringify(message))
		this.logger.log("Receiving msg  from " + message.sender + " to room : " + message.room)
		return ("hello" + message)
		//return this.wss.to(message.room).emit('chatToClient', "Your message: " + message);
	}

	@SubscribeMessage('Join Room')
	handleJoinRoom(client: Socket, room : string ) // data : { room: string, user: string } )
	{
		this.logger.log ("HANDLE JOIN ROOMM EHIHIHEI")
		this.logger.log("HANDLING " + client.data.user.name + " JOINING ROOM : " + room)
		client.join(room);
		this.logger.log(client.data);
		client.emit('Joined Room', room); // answer to client on "On"
		return this.userService.joinChannel(<User>client.data.user, room);

	}

	@SubscribeMessage('Leave Room')
	handleLeaveRoom(client: Socket, data : { room: string, user: string } )
	{
		this.logger.log ("HANDLE LEAVE ROOMM EHIHIHEI")

		client.leave(data.room);
		client.emit('Left Room', data.room);
	}
}
