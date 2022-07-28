import { Body, Sphere, Vec3 } from "cannon-es";

import { PlayerState } from "../../common/data_types/PlayerState";
import { Weapon } from "../../common/data_types/Weapon";
import { WeaponType } from "../../common/data_types/WeaponType";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { BattleArena } from "./BattleArena";

export class Player
{
	public static readonly DEFAULT_MAX_HEALTH: number = 100;

	protected readonly _color: number;

	protected _battleArena: BattleArena;
	protected _body3D: Body;

	protected _currHP: number;
	protected _maxHP: number;

	protected readonly _fist: Weapon;
	protected _currWeapon: Weapon;

	public constructor()
	{
		this._color = 0xFFFFFF * Math.random();

		this._currHP = Player.DEFAULT_MAX_HEALTH;
		this._maxHP = Player.DEFAULT_MAX_HEALTH;

		this._fist = {
			attack: 3,
			range: PLAYER_RADIUS + 0.15,
			type: WeaponType.MELEE,
			coolDownSec: 2
		};
		this._currWeapon = this._fist;
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
			linearDamping: 0.9
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

			currHP: this._currHP,
			maxHP: this._maxHP,
			isAlive: this.isAlive,

			currWeapon: this._currWeapon
		};
	}

	/** Function for increasing/decreasing HP
	 * @param delta delta > 0 for healing, delta < 0 for damage
	 */
	public changeHP(delta: number): void
	{
		this._currHP += delta;
		if (this._currHP > this._maxHP)
		{
			this._currHP = this._maxHP;
		}
		if (this._currHP < 0)
		{
			this._currHP = 0;
		}
	}

	public attack(): void
	{
		this._battleArena.playerAttacked(this);
	}

	public get color(): number
	{
		return this._color;
	}

	public get body(): Body
	{
		return this._body3D;
	}

	public get currHP(): number
	{
		return this._currHP;
	}

	public get maxHP(): number
	{
		return this._maxHP;
	}

	public get isAlive(): boolean
	{
		return this._currHP <= 0;
	}

	public get currWeapon(): Weapon
	{
		return this._currWeapon;
	}
}
