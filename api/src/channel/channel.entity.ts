


import { channelMessage } from "src/message/message/channelMessage.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('Channels') /** table name */
export class Channel extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

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


	/** Tous les messages du channel */
	//@ManyToMany(() => User, user => user.channelMessages)
	@OneToMany(() => channelMessage, channelMessage => channelMessage.target)
	messages: channelMessage[];


}
