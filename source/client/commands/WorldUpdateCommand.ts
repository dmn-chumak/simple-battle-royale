import { WorldUpdatedMessage } from "../../common/commands/WorldUpdatedMessage";
import { ClientCommand } from "../ClientCommand";

export class WorldUpdateCommand extends ClientCommand<WorldUpdatedMessage>
{
	public execute(): void
	{
		for (const data of this._message.data)
		{
			const client = this._scene.clientsMap[data.id];
			client.x = data.x;
			client.y = data.y;
		}
	}
}
