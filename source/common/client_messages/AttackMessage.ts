import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface AttackMessage extends CommandMessage
{
	type: CommandType.CL_ATTACK,
	data: {};
}