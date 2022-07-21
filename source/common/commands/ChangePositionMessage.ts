import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface ChangePositionMessage extends CommandMessage
{
	type: CommandType.CL_CHANGE_POSITION;
	data: {
		x: number;
		y: number;
	};
}
