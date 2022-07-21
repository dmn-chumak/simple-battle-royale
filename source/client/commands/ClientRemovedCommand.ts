import { ClientRemovedMessage } from "../../common/commands/ClientRemovedMessage";
import { ClientCommand } from "../ClientCommand";

export class ClientRemovedCommand extends ClientCommand<ClientRemovedMessage>
{
	public execute(): void
	{
		this._scene.removeClient(this._message.data);
	}
}
