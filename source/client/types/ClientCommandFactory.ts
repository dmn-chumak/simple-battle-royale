import { Command } from "../../common/Command";
import { CommandMessage } from "../../common/CommandMessage";
import { GameScene } from "../GameScene";

export interface ClientCommandFactory
{
	[type: number]: { new(message: CommandMessage, sene: GameScene): Command<CommandMessage> };
}
