import { Vec3 } from "cannon-es";
import { PlayerMovementMessage } from "../../common/client_messages/PlayerMovementMessage";
import { PLAYER_SPEED } from "../../common/GameConfig";
import { ServerCommand } from "../ServerCommand";

export class PlayerMovementCommand extends ServerCommand<PlayerMovementMessage>
{
	public override execute()
	{
		if (!this._client.player.isAlive)
		{
			return;
		}

		const { moveForward, moveBackward, moveLeft, moveRight, jump } = this._message.data;

		if (moveRight)
		{
			this._client.player.body.velocity.x += PLAYER_SPEED;
		}
		else if (moveLeft)
		{
			this._client.player.body.velocity.x -= PLAYER_SPEED;
		}

		if (moveBackward)
		{
			this._client.player.body.velocity.z += PLAYER_SPEED;
		}
		else if (moveForward)
		{
			this._client.player.body.velocity.z -= PLAYER_SPEED;
		}

		if (jump)
		{
			this._client.player.body.applyImpulse(new Vec3(0, 20, 0));
		}
	}
}
