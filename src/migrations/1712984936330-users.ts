import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1712984936330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE "user" (
            "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
            "email" varchar NOT NULL,
            "password" varchar NOT NULL,
            "firstName" varchar NOT NULL,
            "lastName" varchar NOT NULL,
            "role" user_role_enum DEFAULT 'USER'::user_role_enum NOT NULL,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            "updatedAt" timestamp DEFAULT now() NOT NULL,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
        );
        `
    ),
      undefined;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
