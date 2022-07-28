import { AttackMessage } from "../../common/client_messages/AttackMessage";
import { ServerCommand } from "../ServerCommand";

export class AttackCommand extends ServerCommand<AttackMessage>
{
	public execute(): void
	{
		this._client.player.attack();
	}
}