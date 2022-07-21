import { Command } from "../../common/Command";
import { CommandMessage } from "../../common/CommandMessage";
import { GameClientState } from "../GameClientState";
import { GameServer } from "../GameServer";

export interface ServerCommandFactory
{
	[type: number]: { new(message: CommandMessage, server: GameServer, client: GameClientState): Command<CommandMessage> };
}
