import { DataType } from "sequelize-typescript";
import { Column } from "sequelize-typescript";
import { ForeignKey } from "sequelize-typescript";
import { Model } from "sequelize-typescript";
import { Table } from "sequelize-typescript";

import { Match } from "./Match";
import { User } from "./User";

@Table
export class UsersMatch extends Model
{
	@ForeignKey(() => User)
	@Column
	public get userId(): string
	{
		return this.getDataValue("userId");
	}

	public set userId(value: string)
	{
		this.setDataValue("userId", value);
	}

	@ForeignKey(() => Match)
	@Column
	public get matchId(): number
	{
		return this.getDataValue("matchId");
	}

	public set matchId(value: number)
	{
		this.setDataValue("matchId", value);
	}

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0
	})
	public get kills(): number
	{
		return this.getDataValue("kills");
	}

	public set kills(value: number)
	{
		this.setDataValue("kills", value);
	}
}