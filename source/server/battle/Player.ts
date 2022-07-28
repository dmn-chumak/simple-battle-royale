import { Body, Sphere, Vec3 } from 'cannon-es';

import { PlayerState } from "../../common/data_types/PlayerState";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { BattleArena } from "./BattleArena";

export class Player
{
	protected readonly _color: number;

	protected _battleArena: BattleArena;
	protected _body3D: Body;

	public constructor()
	{
		this._color = 0xFFFFFF * Math.random();
	}

	public enterBattleArena(battleArena: BattleArena): void
	{
		this._battleArena = battleArena;

		this._body3D = new Body({
			mass: 50, //kg
			shape: new Sphere(PLAYER_RADIUS),
			position: new Vec3(
				//1 + 5 * Math.random(),
				0,
				1,
				0
			),
			allowSleep: false,
			linearDamping: 0.9,
		});

		this._battleArena.addPlayer(this._body3D);
	}

	public leaveBattleArena(): void
	{
		this._battleArena.removePlayer(this._body3D);
		this._battleArena = null;

		this._body3D = null;
	}

	public beforeUpdateFrame(): void
	{
		//this._body.SetLinearVelocity({ x: 0, y: 0 });
	}

	public updateFrame(): void
	{
		// empty
	}

	public getCurrentState(): PlayerState
	{
		const position = this._body3D.position;

		return {
			color: this._color,
			x: position.x,
			y: position.y,
			z: position.z,
		};
	}

	public get color(): number
	{
		return this._color;
	}

	public get body(): Body
	{
		return this._body3D;
	}
}
