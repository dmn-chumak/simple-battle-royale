import { GameScene } from "./GameScene";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";

export class LoaderScene extends Scene
{
	public override start(manager: SceneManager): void
	{
		super.start(manager);

		manager.socket = new WebSocket(location.href.replace(/^http/, "ws"));

		manager.socket.onclose = () =>
		{
			manager.changeScene(new LoaderScene());
		};

		manager.socket.onopen = () =>
		{
			manager.changeScene(new GameScene());
		};
	}
}
