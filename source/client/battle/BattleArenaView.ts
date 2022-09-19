import { Object3D } from "three";
import { clone as cloneSkeletone } from "three/examples/jsm/utils/SkeletonUtils";
import { LoaderScene } from "../common_scenes/LoaderScene";
import { ResourceManager } from "../ResourceManager";
import { GRASS_NAMES } from "../TerainConfig";
import { TERRAIN_CONFIG } from "../TerainConfig";

export class BattleArenaView extends Object3D
{
	protected GRASS_COUNT = 500;

	constructor()
	{
		super();

		const resourceManager = ResourceManager.getInstance();
		const gltfModel = resourceManager.obtainGLTFObject("terrain");

		TERRAIN_CONFIG.forEach((object) => {
			const cloneScene = cloneSkeletone(gltfModel.scene.getObjectByName(object.name));
			cloneScene.position.set(object.x, object.y, object.z);
			this.add(cloneScene);
		});

		//set random grass and flowers to the map
		for (let i = 0; i < this.GRASS_COUNT; i++)
		{
			const skins = GRASS_NAMES;
			const skin = skins[Math.floor(Math.random() * skins.length)];
			const cloneScene = cloneSkeletone(gltfModel.scene.getObjectByName(skin));
			const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
			const plusOrMinusZ = Math.random() < 0.5 ? -1 : 1;
			const x = (Math.floor(Math.random() * 50)) * plusOrMinusX;
			const z = (Math.floor(Math.random() * 50)) * plusOrMinusZ;
			cloneScene.position.set(x, 0, z);
			this.add(cloneScene);
		}

	}
}
