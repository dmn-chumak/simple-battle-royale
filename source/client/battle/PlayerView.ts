import { MeshLambertMaterial } from "three";
import { SphereGeometry } from "three";
import { Mesh } from "three";
import { Object3D } from "three";
import { PLAYER_RADIUS } from "../../common/GameConfig";

export class PlayerView extends Object3D
{
	private  _currHp: number;
	private  _maxHp: number;

	public constructor(color: number)
	{
		super();

		const circle = new Mesh(new SphereGeometry(PLAYER_RADIUS), new MeshLambertMaterial({color}));
		circle.castShadow = true;
		circle.receiveShadow = true;
		this.add(circle);
	}

	public get currHp(): number
	{
		return this._currHp;
	}

	public get maxHp(): number
	{
		return this._maxHp;
	}

	public set currHp(hp: number)
	{
		this._currHp = hp;
	}

	public set maxHp(hp: number)
	{
		this._maxHp = hp;
	}
}
