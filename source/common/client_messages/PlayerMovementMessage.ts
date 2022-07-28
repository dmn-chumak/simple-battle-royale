import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export type PlayerMovementMessageData = {
	moveForward: boolean;
	moveBackward: boolean;
	moveLeft: boolean;
	moveRight: boolean;
	jump: boolean;

}

export interface PlayerMovementMessage extends CommandMessage
{
	type: CommandType.CL_PLAYER_MOVEMENT,
	data: PlayerMovementMessageData,
}
