import { ClientAddedMessage } from "../../common/commands/ClientAddedMessage";
import { ClientCommand } from "../ClientCommand";

export class ClientAddedCommand extends ClientCommand<ClientAddedMessage>
{
	public execute(): void
	{
		this._scene.createClient(this._message.data);
	}
}
