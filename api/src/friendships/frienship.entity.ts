import { uuidDto } from "src/dtos/uuid.dto";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

@Entity('Friendships') /** table name */
export class Friendships extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")  // id du match
	id: string;

	@Column()
	sender: string; // uuid de l'initiateurice de la req

	@Column()
	target: string; // uuid de la personne avec qui on veut etre poto

	@Column()
	status: string; // on mettra "PENDING" ou "ACCEPTED"
}
