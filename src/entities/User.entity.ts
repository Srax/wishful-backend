import {
  IsDefined,
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
  ManyToOne,
  AfterInsert,
  JoinColumn,
} from "typeorm";
import { Base } from "./Base.entity";
import { UserRole } from "../types/roles.type";
import { Role } from "./Role.entity";

/**
TODO: Fix issue where class-validations are being ignored
 * Possible fix: Do validation in DTO's
 * Check: https://stackoverflow.com/questions/67340193/class-validator-doesnt-validate-entity
 * Alternatively: Fix to JOI validators: https://medium.com/@andre_ho/crud-rest-api-with-express-typeorm-and-jest-for-testing-part-2-18f1b6bc02d6
 */

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn("uuid")
  readonly id!: string;

  @Column({ nullable: false, unique: true })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Column("varchar", { name: "password", nullable: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long" }) // Minimum length
  @MaxLength(50, { message: "Password must be at most 50 characters long" }) // Maximum length
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   {
  //     message:
  //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  //   }
  // ) // Strong password pattern
  password: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: "First name must be at least 2 characters long" }) // Minimum length
  @MaxLength(50, { message: "First name must be at most 50 characters long" }) // Maximum length
  firstName: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: "Last name must be at least 2 characters long" }) // Minimum length
  // @MaxLength(50, { message: "Last name must be at most 50 characters long" }) // Maximum length
  lastName: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: "role_id" })
  @IsDefined()
  role!: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async setDefaultRole() {
    if (!this.role) {
      // Assuming there's a predefined role named 'USER'
      const defaultRole = await Role.findOne({
        where: { name: UserRole.USER },
      });
      if (defaultRole) {
        this.role = defaultRole;
        // await this.save();
      } else {
        throw new Error('Default role "USER" not found.');
      }
    }
  }
  // @BeforeInsert()
  // async hashPassword() {
  //   const saltRounds = 10;
  //   const salt = await bcrypt.genSalt(saltRounds);
  //   this.password = await bcrypt.hash(this.password, salt);
  // }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async validate() {
  //   console.log("calling validate");
  //   await validateOrReject(this);
  // }

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    super();
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
