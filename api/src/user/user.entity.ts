
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
		type: 'int',
		default: 0
	})
	wonMatches: number;

	@Column({
		nullable: true,
		select: false
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

	@OneToMany(() => channelMessage, channelMessage => channelMessage.sender) // peut etre zapper ca et mettre juste l'id des senders
	channelMessages: channelMessage[];

	@Column('varchar', { array: true, nullable : true})
	blocked: string[]; // tableau d'id pour les bloques


}
