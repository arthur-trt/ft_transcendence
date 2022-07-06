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
		this.logger.log(`connection ! ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log('DECONNECT !')
	}

	@SubscribeMessage('chatToServer')
	handleMessage(client: Socket, message: { sender: string, message: string }) {
		// return { event : 'msgToClient', data: "Recu " + text}
		///	client.emit('msg to client', text); */
		return this.wss.emit('chatToClient', message);
		//return 'Hello world!'; */
	}
}
