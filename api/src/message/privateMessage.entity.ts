
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { AMessage } from "./AMessage.entity";


@Entity('privateMessage')
export class privateMessage extends AMessage {

	@Column("uuid")
	sender: string;

	@Column("uuid")
	target: string; // UUID
}
