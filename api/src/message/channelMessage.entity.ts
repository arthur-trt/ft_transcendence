
import { Channel } from "src/channel/channel.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { AMessage } from "./AMessage.entity";


@Entity('channelMessage')
export class channelMessage extends AMessage {

	@Column(({ type: 'json'})) 
	sender: User;

	@ManyToOne(() => Channel,  channel => channel.messages)
	target: Channel;

}
