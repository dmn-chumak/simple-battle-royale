import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface ChangeWeaponMessage extends CommandMessage
{
	type: CommandType.CL_CHANGE_WEAPON,
	data: {};
}
