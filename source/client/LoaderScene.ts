import { SERVER_PATH } from "../common/GameConfig";
import { GameScene } from "./GameScene";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";

export class LoaderScene extends Scene
{
	public override start(manager: SceneManager): void
	{
		super.start(manager);

		manager.socket = new WebSocket(`${ location.protocol.replace("http", "ws") }//${ location.host }${ SERVER_PATH }`);

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
