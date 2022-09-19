import { PlayerType } from "../../common/data_types/PlayerType";
import { SceneManager } from "../SceneManager";
import { GameServerConnectScene } from "./GameServerConnectScene";
import { Scene } from "./Scene";

export class LoaderScene extends Scene
{
	public static readonly MODEL_TYPES: string[] = [ PlayerType.DRINKER, PlayerType.GUARD, PlayerType.WARRIOR_GIRL ];

	public override start(manager: SceneManager): void
	{
		const { resourceManager } = manager.application;

		resourceManager.registerThreeDataTexture("env", "environment.hdr");
		resourceManager.registerThreeModel(LoaderScene.MODEL_TYPES[0], "characters/cigar_guy.glb");
		resourceManager.registerThreeModel(LoaderScene.MODEL_TYPES[1], "characters/guard.glb");
		resourceManager.registerThreeModel(LoaderScene.MODEL_TYPES[2], "characters/warrior_girl.glb");

		resourceManager.registerThreeModel("terrain", "world/world_assets.glb");

		resourceManager.progressCallback = (progress: number) => {
			console.log(`Loading progress: ${ (progress * 100).toFixed(0) }%`);
		};

		resourceManager.completeCallback = () => {
			manager.changeScene(new GameServerConnectScene());
			console.log("Loading complete!");
		};

		resourceManager.loadResources();
	}
}