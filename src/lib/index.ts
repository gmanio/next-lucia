import { DataSourceOptions } from "typeorm";
import { AccountEntity, UserEntity } from "./entities/UserEntity";

export * from "./entities/UserEntity";
export const connection: DataSourceOptions = {
  type: "mysql",
  host: "152.67.202.155",
  port: 3306,
  username: "root",
  password: "!Wlakscjs87",
  database: "auth",
  synchronize: false,
  logging: false,
  entities: [UserEntity, AccountEntity],
};

import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "152.67.202.155",
  port: 3306,
  username: "root",
  password: "!Wlakscjs87",
  database: "auth",
  synchronize: true,
  logging: false,
  entities: [UserEntity, AccountEntity],
});
