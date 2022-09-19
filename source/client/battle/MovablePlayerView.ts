import { PlayerMovementMessageData } from "../../common/client_messages/PlayerMovementMessage";
import { PlayerMovementMessage } from "../../common/client_messages/PlayerMovementMessage";
import { CommandType } from "../../common/CommandType";
import { PlayerType } from "../../common/data_types/PlayerType";
import { ClientApplication } from "../ClientApplication";
import { PlayerView } from "./PlayerView";

interface KeyMap
{
	[code: string]: boolean;
}

export class MovablePlayerView extends PlayerView
{
	private readonly _application: ClientApplication;
	private readonly _keysMap: KeyMap;

	public constructor(application: ClientApplication, type: PlayerType)
	{
		super(type);

		this._application = application;
		this._keysMap = {};

		document.body.onkeydown = (event) =>
		{
			this._keysMap[event.code] = true;
			if (event.code === "Key1")
			{
				this.playerChangedWeapon();
			}
		};

		document.body.onkeyup = (event) =>
		{
			this._keysMap[event.code] = false;
		};
	}

	public update(): void
	{
		const movementData: PlayerMovementMessageData = {
			moveForward: false,
			moveBackward: false,
			moveLeft: false,
			moveRight: false,
			jump: false,
		};

		if (this._keysMap["ArrowLeft"] || this._keysMap["KeyA"])
		{
			movementData.moveLeft = true;
		}

		if (this._keysMap["ArrowRight"] || this._keysMap["KeyD"])
		{
			movementData.moveRight = true;
		}

		if (this._keysMap["ArrowUp"] || this._keysMap["KeyW"])
		{
			movementData.moveForward = true;
		}

		if (this._keysMap["ArrowDown"] || this._keysMap["KeyS"])
		{
			movementData.moveBackward = true;
		}

		if (this._keysMap["Space"])
		{
			movementData.jump = true;
		}

		const message: PlayerMovementMessage = {
			type: CommandType.CL_PLAYER_MOVEMENT,
			data: movementData
		};
		this._application.sendMessage(message);
	}

	protected playerChangedWeapon(): void
	{
		this._application.sendMessage({
			type: CommandType.CL_CHANGE_WEAPON,
			data: {}
		});
	}
}
