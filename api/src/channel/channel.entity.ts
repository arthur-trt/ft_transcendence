


import { channelMessage } from "src/message/channelMessage.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('Channels') /** table name */
export class Channel extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		type: 'varchar',
	})
	name: string;

	@Column({
		type: 'boolean',
		default: false,
	})
	password_protected: boolean

	@Column({
		type: 'boolean',
		default: false,
	})
	private: boolean

	@Column({
		type: 'varchar',
		default: null,
		nullable: true,
		select: false
	})
	password: string

	@ManyToOne(() => User, { nullable: true, cascade: true, onDelete: 'CASCADE', orphanedRowAction: 'delete'})
	owner: User;

	/** Tous les users du channel */
	@ManyToMany(() => User, user => user.channels, { cascade: true, onDelete: 'CASCADE', orphanedRowAction: 'delete'})
	@JoinTable()		/* owner is channels */
	users: User[]

	/** Tous les messages du channel : un message n'a qu'une target, un channel a plusieurs messages */
	@OneToMany(() => channelMessage, (channelMessage) => channelMessage.target)
	messages: channelMessage[];

	@ManyToMany(() => User)
	@JoinTable()
	banned: User[];

}
