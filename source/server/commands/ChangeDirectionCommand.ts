import { ChangeDirectionMessage } from "../../common/client_messages/ChangeDirectionMessage";
import { PLAYER_SPEED } from "../../common/GameConfig";
import { ServerCommand } from "../ServerCommand";

export class ChangeDirectionCommand extends ServerCommand<ChangeDirectionMessage>
{
	public override execute(): void
	{
		const {deltaX, deltaY} = this._message.data;

		//this._client.player.body.velocity.x += deltaX * PLAYER_SPEED;
		//this._client.player.body.velocity.y += deltaY * PLAYER_SPEED;
	}
}
