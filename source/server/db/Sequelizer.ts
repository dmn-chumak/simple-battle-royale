import { Sequelize } from "sequelize-typescript";

import pg from "pg";

import { Match } from "./models/Match";
import { User } from "./models/User";
import { UsersMatch } from "./models/UsersMatch";

export const sequelize = new Sequelize({
	dialect: "postgres",
	dialectModule: pg,
	database: "simple-battle-royale",
	username: "admin",
	password: "admin",
	storage: ":memory:",
	models: [ User, Match, UsersMatch ]
});