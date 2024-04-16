import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.entity";
import config from "./config/config";
import { Role } from "./entities/Role.entity";
import { RefreshToken } from "./entities/refreshToken.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USERNAME,
  password: config.DB.PASSWORD,
  database: config.DB.DATABASE,
  synchronize: config.DB.SYNCHRONIZED,
  logging: config.DB.LOGGING,
  entities: [User, Role, RefreshToken],
  migrations: [__dirname + "/migrations/*.ts"],
  subscribers: [],
});
