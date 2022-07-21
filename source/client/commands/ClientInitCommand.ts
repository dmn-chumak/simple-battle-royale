import { ClientInitMessage } from "../../common/commands/ClientInitMessage";
import { ClientCommand } from "../ClientCommand";

export class ClientInitCommand extends ClientCommand<ClientInitMessage>
{
	public execute(): void
	{
		const { client, clients } = this._message.data;

		this._scene.initializeClient(client);
		this._scene.createClient(client);

		for (const state of clients)
		{
			this._scene.createClient(state);
		}
	}
}
