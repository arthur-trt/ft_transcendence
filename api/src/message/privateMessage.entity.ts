
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { AMessage } from "./AMessage.entity";


@Entity('privateMessage')
export class privateMessage extends AMessage {

	@Column()
	sender: string; // uuid du sender
	//@ManyToOne(() => User, user => user.privateMessages)

	@Column()
	target: string; //on stocke lúuid au lieu de relationner
	//target: User;
}
