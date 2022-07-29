import { SceneManager } from "../SceneManager";
import { GameServerConnectScene } from "./GameServerConnectScene";
import { Scene } from "./Scene";

export class LoaderScene extends Scene
{
	public static readonly MODEL_TYPES: string[] = [ "drinker", "guard", "warriorGirl" ];

	public override start(manager: SceneManager): void
	{
		const { resourceManager } = manager.application;

		resourceManager.registerThreeDataTexture("env", "environment.hdr");
		resourceManager.registerThreeModel(LoaderScene.MODEL_TYPES[0], "characters/cigar_guy.glb");
		resourceManager.registerThreeModel(LoaderScene.MODEL_TYPES[1], "characters/guard.glb");
		resourceManager.registerThreeModel(LoaderScene.MODEL_TYPES[2], "characters/warrior_girl.glb");

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
