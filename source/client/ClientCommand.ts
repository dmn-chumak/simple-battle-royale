import { Command } from "../common/Command";
import { CommandMessage } from "../common/CommandMessage";
import { GameScene } from "./GameScene";

export abstract class ClientCommand<MessageType extends CommandMessage> extends Command<MessageType>
{
	protected readonly _scene: GameScene;

	public constructor(message: MessageType, scene: GameScene)
	{
		super(message);

		this._scene = scene;
	}
}
