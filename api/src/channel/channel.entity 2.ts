


import { channelMessage } from "src/message/channelMessage.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('Channels') /** table name */
export class Channel extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		type: 'varchar',
	})
	name: string;

	@ManyToOne(() => User) // on link aps, est ce que ca va marcher ?
	owner: User; // slt son nom ou tout lúser ? a discuter

	/** Tous les users */
	@ManyToMany(() => User, user => user.channels)
	@JoinTable()		/* owner is channels */
	users: User[]


	/** Tous les messages du channel : un message n'a qu'une target, un channel a plusieurs messages */
	@OneToMany(() => channelMessage, (channelMessage) => channelMessage.target)
	messages: channelMessage[];


}
