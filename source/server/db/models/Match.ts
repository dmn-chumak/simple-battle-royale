import { AutoIncrement } from "sequelize-typescript";
import { BelongsToMany } from "sequelize-typescript";
import { ForeignKey } from "sequelize-typescript";
import { BelongsTo } from "sequelize-typescript";
import { DataType } from "sequelize-typescript";
import { PrimaryKey } from "sequelize-typescript";
import { Column } from "sequelize-typescript";
import { Model } from "sequelize-typescript";
import { Table } from "sequelize-typescript";

import { User } from "./User";
import { UsersMatch } from "./UsersMatch";

@Table
export class Match extends Model
{
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.BIGINT)
	public get matchId(): number
	{
		return this.getDataValue("matchId");
	}

	public set matchId(value: number)
	{
		this.setDataValue("matchId", value);
	}

	@ForeignKey(() => User)
	@Column
	public get winnerUserId(): string
	{
		return this.getDataValue("winnerUserId");
	}

	public set winnerUserId(value: string)
	{
		this.setDataValue("winnerUserId", value);
	}

	@BelongsTo(() => User)
	public get winnerUser(): User
	{
		return this.getDataValue("winnerUser");
	}

	@BelongsToMany(() => User, () => UsersMatch)
	public get users(): User[]
	{
		return this.getDataValue("users");
	}
}