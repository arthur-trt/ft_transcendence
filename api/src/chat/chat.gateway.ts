import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { text } from "express";
import {Server, Socket} from 'socket.io'


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger("This gateway")

afterInit(server: Server) {
	this.logger.log('init')
}

handleConnection(client: Socket, ...args: any[]) {
	this.logger.log(`connection ! ${ client.id }`)
}
	handleDisconnect(client: Socket) {
		this.logger.log('DECONNECT !')
	}
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): any  {
	 // return { event : 'msgToClient', data: "Recu " + text}
	///	client.emit('msg to client', text); */
	return this.wss.emit('msgToClient', text)
		//return 'Hello world!'; */
  }
}
