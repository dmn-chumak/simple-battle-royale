import { CommandType } from "./CommandType";

export interface CommandMessage
{
	type: CommandType;
	data: unknown;
}
