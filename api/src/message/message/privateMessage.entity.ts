
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { AMessage } from "./AMessage.entity";


@Entity('privateMessage')
export class privateMessage extends AMessage {

    @ManyToMany(() => User, user => user.privateMessages)
    target : User;
}
