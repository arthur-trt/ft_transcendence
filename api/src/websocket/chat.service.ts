import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { ChannelService } from "src/channel/channel.service";
import { FriendshipsService } from "src/friendships/friendships.service";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { WSServer } from "./wsserver.gateway";


@Injectable()
export class ChatService {

	private server;
	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		@Inject(forwardRef(() => WSServer)) protected gateway: WSServer
	) {}

	async getRooms()
	{
		for (let [allUsers, socket] of this.gateway.activeUsers.entries())
			this.gateway.server.to(socket.id).emit('rooms', " get rooms ", await this.channelService.getChannelsForUser(allUsers));
	}

	



}
