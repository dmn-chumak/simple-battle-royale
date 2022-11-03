import { AllowNull } from "sequelize-typescript";
import { PrimaryKey } from "sequelize-typescript";
import { DataType } from "sequelize-typescript";
import { Column } from "sequelize-typescript";
import { Model } from "sequelize-typescript";
import { Table } from "sequelize-typescript";

@Table
export class User extends Model
{
	@PrimaryKey
	@Column(DataType.STRING)
	public get userId(): string
	{
		return this.getDataValue("userId");
	}

	public set userId(value: string)
	{
		this.setDataValue("userId", value);
	}

	@AllowNull(false)
	@Column(DataType.STRING)
	public get password(): string
	{
		return this.getDataValue("password");
	}

	public set password(value: string)
	{
		this.setDataValue("password", value);
	}
}