import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('UserActivity')
export class UserActivity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@OneToOne(() => User)
	@JoinColumn()
	user: User

	@Column({
		default: () => "now()",
		type: 'timestamptz'
	 })
	online_since: Date;
}
