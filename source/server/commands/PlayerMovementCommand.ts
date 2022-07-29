import { Vec3 } from "cannon-es";
import { PlayerMovementMessage } from "../../common/client_messages/PlayerMovementMessage";
import { ROTATE_SPEED } from "../../common/GameConfig";
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
		let velocity = 0;

		if (moveRight)
		{
			this._client.player.rotation -= ROTATE_SPEED;
		}
		else if (moveLeft)
		{
			this._client.player.rotation += ROTATE_SPEED;
		}

		if (moveBackward)
		{
			velocity -= PLAYER_SPEED;
		}
		else if (moveForward)
		{
			velocity += PLAYER_SPEED;
		}

		this._client.player.body.velocity.x += Math.sin(this._client.player.rotation) * velocity;
		this._client.player.body.velocity.z += Math.cos(this._client.player.rotation) * velocity;

		if (jump)
		{
			this._client.player.body.applyImpulse(new Vec3(0, 20, 0));
		}
	}
}
