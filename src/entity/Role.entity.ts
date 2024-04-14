import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  validateOrReject,
} from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { Base } from "./Base.entity";
import { UserRole } from "../types/roles.type";
import { User } from "./User.entity";

@Entity()
export class Role extends Base {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
