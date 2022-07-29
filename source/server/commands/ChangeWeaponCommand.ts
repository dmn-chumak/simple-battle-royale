import { ChangeWeaponMessage } from "../../common/client_messages/ChangeWeaponMessage";
import { ServerCommand } from "../ServerCommand";

export class ChangeWeaponCommand extends ServerCommand<ChangeWeaponMessage>
{
	public override execute(): void
	{
		this._client.player.changeWeapon();
	}
}
