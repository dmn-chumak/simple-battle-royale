import { SERVER_HOST } from "../common/GameConfig";
import { SERVER_PORT } from "../common/GameConfig";
import { GameScene } from "./GameScene";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";

export class LoaderScene extends Scene
{
	public override start(manager: SceneManager): void
	{
		super.start(manager);

		manager.socket = new WebSocket(`ws://${ SERVER_HOST }:${ SERVER_PORT }`);

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
