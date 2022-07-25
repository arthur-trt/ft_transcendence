import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { ChannelService } from "src/channel/channel.service";
import { FriendshipsService } from "src/friendships/friendships.service";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";


@Injectable()
export class ChatService {

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService,
		protected server,
		protected active_users : Map<User, Socket>
	) { }

	async getRooms()
	{
		for (let [allUsers, socket] of this.active_users.entries())
			this.server.to(socket.id).emit('rooms', " get rooms ", await this.channelService.getChannelsForUser(allUsers));)
	}

}
