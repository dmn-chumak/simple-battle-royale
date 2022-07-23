import { SceneManager } from "../SceneManager";
import { GameServerConnectScene } from "./GameServerConnectScene";
import { Scene } from "./Scene";

export class LoaderScene extends Scene
{
	public override start(manager: SceneManager): void
	{
		const { resourceManager } = manager.application;

		resourceManager.registerPixiSprite("sprite", "example.png");
		resourceManager.registerThreeTexture("texture", "example.png");
		resourceManager.registerThreeModel("model", "example.glb");
		resourceManager.registerSound("sound", "example.mp3");

		resourceManager.progressCallback = (progress: number) =>
		{
			console.log(`Loading progress: ${ (progress * 100).toFixed(0) }%`);
		};

		resourceManager.completeCallback = () =>
		{
			manager.changeScene(new GameServerConnectScene());
			console.log("Loading complete!");
		};

		resourceManager.loadResources();
	}
}
