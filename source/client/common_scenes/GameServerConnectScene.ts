import { SceneManager } from "../SceneManager";
import { GameScene } from "./GameScene";
import { Scene } from "./Scene";

export class GameServerConnectScene extends Scene
{
	private readonly _userId: string;

	constructor(userId: string)
	{
		super();
		this._userId = userId;
	}

	public override start(manager: SceneManager): void
	{
		const socket = manager.application.socket = new WebSocket(location.href.replace(/^http/, "ws") + "?userId=" + this._userId);

		socket.onclose = () =>
		{
			manager.changeScene(new GameServerConnectScene(this._userId));
		};

		socket.onopen = () =>
		{
			manager.changeScene(new GameScene());
		};
	}
}
