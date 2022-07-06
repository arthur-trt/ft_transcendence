import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { text } from "express";
import { Server, Socket } from 'socket.io'


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger("Chat gateway")

	afterInit(server: Server) {
		this.logger.log('init')
	}

	handleConnection(client: Socket, ...args: any[]) {
		client.emit('init'); // answer to client on "On"
		this.logger.log(`connection ! ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log('DECONNECT !')
	}

	@SubscribeMessage('chatToServer')
	handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
		return this.wss.to(message.room).emit('chatToClient', message);
	}

	@SubscribeMessage('Join Room')
	handleJoinRoom(client: Socket, room: string)
	{
		this.logger.log("HANDLE JOIN ROOM"+ room)
		client.join(room);
		client.emit('Joined Room', room); // answer to client on "On"
	}

	@SubscribeMessage('Leave Room')
	handleLeaveRoom(client: Socket, room: string)
	{
		client.leave(room);
		client.emit('Left Room', room);
	}

}
