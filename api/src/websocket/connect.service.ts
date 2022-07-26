import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { jwtConstants } from "src/auth/jwt/jwt.constants";
import { Channel } from "src/channel/channel.entity";
import { ChannelService } from "src/channel/channel.service";
import { FriendshipsService } from "src/friendships/friendships.service";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { WSServer } from "./wsserver.gateway";



@Injectable()
export class ConnectService {

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService,
		@Inject(forwardRef(() => WSServer)) protected gateway: WSServer
	) { }

	private all_users : User[];

	async validateConnection(client) {
		try {
			const authCookies: string[] = client.handshake.headers.cookie.split('; ');
			const authCookie: string[] = authCookies.filter(s => s.includes('Authentication='));
			const authToken = authCookie[0].substring(15, authCookie[0].length);
			const jwtOptions: JwtVerifyOptions = {
				secret: jwtConstants.secret
			}
			const jwtPayload = await this.jwtService.verify(authToken, jwtOptions);
			const user: any = await this.userService.getUserByIdentifierLight(jwtPayload.sub);
			return user;
		} catch (err) {
			console.log("Guard error :");
			console.log(err.message);
		}
	}

	async handleConnection(client: Socket) {
		const user = await this.validateConnection(client);
		if (!user)
			return this.handleDisconnect(client);


		client.data.user = user;
		this.all_users = await this.userService.getUsers();
		if (!this.gateway.activeUsers.has(user)) {
			console.log("Add : " + user.name);
			this.gateway.activeUsers.set(user, client);
		}

		this.gateway.activeUsers.forEach((socket: Socket, user: User) => {
			this.gateway.server.to(socket.id).emit(
				'listUsers',
				this.listConnectedUser(socket, this.all_users, this.gateway.activeUsers, false)
			);
		});

		let chan: Channel[] = await this.userService.getChannelsForUser(user);
		for (let c of chan) {
			client.join(c.name);
		}
	}


	async handleDisconnect(client: Socket) {
		try {
			for (let [entries, socket] of this.gateway.activeUsers.entries())
			{
				if (entries.id == client.data.user.id)
				{
					this.gateway.activeUsers.delete(entries);
					break;
				}
			}
		}
		catch (err) {
			console.log("Don't know what happened");
		}
		this.gateway.activeUsers.forEach((socket: Socket, user: User) => {
			this.gateway.server.to(socket.id).emit(
				'listUsers',
				this.listConnectedUser(socket, this.all_users, this.gateway.activeUsers, false)
			);
		});
		client.emit('bye');
		client.disconnect(true);
	}


	public listConnectedUser(client: Socket, all_users: User[] ,active_user: Map<User, Socket>, withCurrentUser: boolean = true) {
		let data: User[] = [];
		let i = 0;

		for (let user of active_user.keys()) {
			user.status = "online";
			if (client.data.user.id == user.id && withCurrentUser) {
				data[i] = user;
				i++;
			}
			else if (client.data.user.id != user.id) {
				data[i] = user;
				i++;
			}
		}
		if (all_users)
		{
			for (let user of all_users)
			{
				if (!data.find(element => element.id == user.id) && client.data.user.id != user.id)
				{
					user.status = "offline";
					data[i] = user;
					i++;
				}
			}
		}
		return (data);
	}

	async getUserList(client: Socket) {

		this.gateway.server.to(client.id).emit(
			'listUsers',
			this.listConnectedUser(client, this.all_users, this.gateway.activeUsers, false)
		);
	}
}
