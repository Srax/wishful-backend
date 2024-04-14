import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from "typeorm";

export abstract class Base extends BaseEntity {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor() {
    super();
    this.updatedAt = new Date(); // Initialize updatedAt in the constructor
  }
}
