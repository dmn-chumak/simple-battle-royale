import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface ChangeDirectionMessage extends CommandMessage
{
	type: CommandType.CL_CHANGE_DIRECTION,
	data: {
		deltaX: number;
		deltaY: number;
	};
}
