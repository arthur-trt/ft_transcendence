
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { AMessage } from "./AMessage.entity";


@Entity('channelMessage')
export class channelMessage extends AMessage {

	@ManyToOne(() => User, user => user.channelMessages)
	@JoinColumn()
	sender: User;

	@ManyToOne(() => Channel,  channel => channel.messages)
	target: Channel;

}
