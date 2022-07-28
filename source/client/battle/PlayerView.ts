import { MeshLambertMaterial } from "three";
import { SphereGeometry } from "three";
import { Mesh } from "three";
import { Object3D } from "three";
import { PLAYER_RADIUS } from "../../common/GameConfig";

export class PlayerView extends Object3D
{
	public constructor(color: number)
	{
		super();

		const circle = new Mesh(new SphereGeometry(PLAYER_RADIUS), new MeshLambertMaterial({color}));
		circle.castShadow = true;
		circle.receiveShadow = true;
		this.add(circle);
	}
}
