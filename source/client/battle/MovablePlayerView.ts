import { CommandType } from "../../common/CommandType";
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

	public constructor(application: ClientApplication, color: number)
	{
		super(color);

		this._application = application;
		this._keysMap = {};

		document.body.onkeydown = (event) =>
		{
			this._keysMap[event.code] = true;
		};

		document.body.onkeyup = (event) =>
		{
			this._keysMap[event.code] = false;
		};
	}

	public update(): void
	{
		let deltaX = 0, deltaY = 0;

		if (this._keysMap["ArrowLeft"] || this._keysMap["KeyA"])
		{
			deltaX = -1;
		}

		if (this._keysMap["ArrowRight"] || this._keysMap["KeyD"])
		{
			deltaX = 1;
		}

		if (this._keysMap["ArrowUp"] || this._keysMap["KeyW"])
		{
			deltaY = -1;
		}

		if (this._keysMap["ArrowDown"] || this._keysMap["KeyS"])
		{
			deltaY = 1;
		}

		this._application.sendMessage({
			type: CommandType.CL_CHANGE_DIRECTION,
			data: {
				deltaX, deltaY
			}
		});
	}
}
