import { SpotLight } from "three";
import { MeshLambertMaterial } from "three";
import { PlaneBufferGeometry } from "three";
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
		const plane = new Mesh(new PlaneGeometry(25, 25), new MeshPhysicalMaterial({color}));

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

	public static createSpotlight(color: number, position: Vector3, target: Vector3): SpotLight
	{
		const spotlight = new SpotLight(color, 0.9, 0, Math.PI / 4, 1);
		spotlight.position.copy(position);
		spotlight.target.position.copy(target);

		spotlight.castShadow = true;

		spotlight.shadow.camera.near = 10;
		spotlight.shadow.camera.far = 100;
		spotlight.shadow.camera.fov = 30;

		spotlight.shadow.mapSize.width = 1024;
		spotlight.shadow.mapSize.height = 1024;

		return spotlight;
	}

	public static createFloor(): Mesh
	{
		const floorMaterial = new MeshLambertMaterial({color: 0xdddddd});
		const floorGeometry = new PlaneBufferGeometry(300, 300, 100, 100);
		floorGeometry.rotateX(-Math.PI / 2);
		const floor = new Mesh(floorGeometry, floorMaterial);
		floor.receiveShadow = true;

		return floor;
	}
}
