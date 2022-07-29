import { Command } from "../../common/Command";
import { CommandMessage } from "../../common/CommandMessage";
import { CommandType } from "../../common/CommandType";
import { ServerOutcomeMessageType } from "../../common/ServerOutcomeMessageType";
import { AddItemsCommand } from "../commands/AddItemsCommand";
import { AppendPlayerCommand } from "../commands/AppendPlayerCommand";
import { InitializeWorldCommand } from "../commands/InitializeWorldCommand";
import { RemovePlayerCommand } from "../commands/RemovePlayerCommand";
import { UpdateWorldCommand } from "../commands/UpdateWorldCommand";
import { GameScene } from "../common_scenes/GameScene";

export interface ClientCommandFactory
{
	[type: number]: { new(message: CommandMessage, scene: GameScene): Command<ServerOutcomeMessageType> };
}

export const COMMAND_FACTORY: ClientCommandFactory = {
	[CommandType.SV_APPEND_PLAYER]: AppendPlayerCommand,
	[CommandType.SV_INITIALIZE_WORLD]: InitializeWorldCommand,
	[CommandType.SV_REMOVE_PLAYER]: RemovePlayerCommand,
	[CommandType.SV_UPDATE_WORLD]: UpdateWorldCommand,
	[CommandType.SV_ADD_ITEMS]: AddItemsCommand,
};
