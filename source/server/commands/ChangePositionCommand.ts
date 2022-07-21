import { ChangePositionMessage } from "../../common/commands/ChangePositionMessage";
import { ServerCommand } from "../ServerCommand";

export class ChangePositionCommand extends ServerCommand<ChangePositionMessage>
{
	public execute(): void
	{
		this._client.data.targetX = this._message.data.x;
		this._client.data.targetY = this._message.data.y;
	}
}
