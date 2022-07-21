import { ChangeDirectionMessage } from "../../common/commands/ChangeDirectionMessage";
import { ServerCommand } from "../ServerCommand";

export class ChangeDirectionCommand extends ServerCommand<ChangeDirectionMessage>
{
	public execute(): void
	{
		this._client.data.deltaX = this._message.data.deltaX;
		this._client.data.deltaY = this._message.data.deltaY;
	}
}
