import { ClientOutcomeMessageType } from "../../common/ClientOutcomeMessageType";
import { Command } from "../../common/Command";
import { CommandMessage } from "../../common/CommandMessage";
import { CommandType } from "../../common/CommandType";
import { PlayerMovementCommand } from "../commands/PlayerMovementCommand";
import { AttackCommand } from "../commands/AttackCommand";
import { ServerApplication } from "../ServerApplication";
import { ServerClient } from "../ServerClient";

export interface ServerCommandFactory
{
	[type: number]: { new(message: CommandMessage, server: ServerApplication, client: ServerClient): Command<ClientOutcomeMessageType> };
}

export const COMMAND_FACTORY: ServerCommandFactory = {
	[CommandType.CL_PLAYER_MOVEMENT]: PlayerMovementCommand,
	[CommandType.CL_ATTACK]: AttackCommand
};
