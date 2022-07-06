
import { channelMessage } from "src/message/channelMessage.entity";
import { privateMessage } from "src/message/privateMessage.entity";
import internal from "stream";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";

@Entity('Users') /** table name */
export class User extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		type: 'varchar',
		unique: true,
	})
	name: string;

	@Column({
		type: 'varchar',
	})
	fullname: string;

	@Column({
		type: 'varchar',
	})
	mail: string;

	@Column({
		type: 'int',
		unique: true
	})
	intra_id: number;

	@Column({
		type: 'varchar'
	})
	avatar_url: string;

	@Column({
		nullable: true,
	})
	TwoFA_secret: string;

	@Column({
		type: 'boolean',
		default: false
	})
	TwoFA_enable: boolean;

	@ManyToMany(() => Channel, channel => channel.users)
	@JoinTable()
	channels: Channel[];

	@OneToMany(() => channelMessage, channelMessage => channelMessage.message) // va faire l'historique des messages
	channelMessages: channelMessage[]; // on store ses messages

}
