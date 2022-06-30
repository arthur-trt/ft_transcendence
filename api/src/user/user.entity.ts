
import { channelMessage } from "src/message/channelMessage.entity";
import { privateMessage } from "src/message/privateMessage.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";
import {v4 as uuidv4} from 'uuid';

@Entity('Users') /** table name */
export class User extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		type: 'varchar',
	})
	name: string;

	@Column({
		type: 'varchar',
	})
	mail: string;

	@ManyToMany(() => Channel, channel => channel.users)
	@JoinTable()
	channels: Channel[]

	@ManyToMany(() => privateMessage)
	@JoinTable()
	privateMessages: privateMessage[];

	@OneToMany(() => channelMessage, channelMessage => channelMessage.message) // va faire l'historique des messages
	channelMessages: channelMessage[]; // on store ses messages


}
