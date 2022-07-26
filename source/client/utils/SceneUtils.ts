import { PointLight } from "three";
import { Light } from "three";
import { Euler } from "three";
import { MeshPhysicalMaterial } from "three";
import { PlaneGeometry } from "three";
import { Mesh } from "three";
import { Vector3 } from "three";

export class SceneUtils
{
	public static createPlane(color: number, position: Vector3, rotation: Euler): Mesh
	{
		const plane = new Mesh(new PlaneGeometry(25, 25), new MeshPhysicalMaterial({ color }));

		plane.setRotationFromEuler(rotation);
		plane.position.copy(position);
		plane.receiveShadow = true;

		return plane;
	}

	public static createLight(color: number, position: Vector3): Light
	{
		const light = new PointLight(color);

		light.position.copy(position);
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		light.castShadow = true;

		return light;
	}
}
