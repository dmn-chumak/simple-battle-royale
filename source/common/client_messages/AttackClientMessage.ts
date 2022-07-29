import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface AttackClientMessage extends CommandMessage
{
	type: CommandType.CL_ATTACK,
	data: {};
}