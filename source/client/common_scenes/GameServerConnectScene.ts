import { SceneManager } from "../SceneManager";
import { GameScene } from "./GameScene";
import { Scene } from "./Scene";

export class GameServerConnectScene extends Scene
{
	public override start(manager: SceneManager): void
	{
		const socket = manager.application.socket = new WebSocket(location.href.replace(/^http/, "ws"));

		socket.onclose = () =>
		{
			manager.changeScene(new GameServerConnectScene());
		};

		socket.onopen = () =>
		{
			manager.changeScene(new GameScene());
		};
	}
}
