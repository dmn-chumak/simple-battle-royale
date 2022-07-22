import { SceneManager } from "../SceneManager";
import { GameServerConnectScene } from "./GameServerConnectScene";
import { Scene } from "./Scene";

export class LoaderScene extends Scene
{
	public override start(manager: SceneManager): void
	{
		manager.changeScene(new GameServerConnectScene());
	}
}
