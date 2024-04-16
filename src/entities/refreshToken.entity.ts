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
import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from "typeorm";
import { Base } from "./Base.entity";

@Entity()
export class RefreshToken extends Base {
  @PrimaryColumn({ nullable: false })
  readonly token: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  expiryDate: Date;

  constructor(token: string, email: string, expiryDate: Date) {
    super();
    this.token = token;
    this.userId = email;
    this.expiryDate = expiryDate;
  }
}
