import { AttackClientMessage } from "../../common/client_messages/AttackClientMessage";
import { ServerCommand } from "../ServerCommand";

export class AttackClientCommand extends ServerCommand<AttackClientMessage>
{
	public execute(): void
	{
		this._client.player.attack();
	}
}