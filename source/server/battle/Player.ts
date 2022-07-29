import { Body, Sphere, Vec3 } from "cannon-es";

import { PlayerState } from "../../common/data_types/PlayerState";
import { Weapon } from "../../common/data_types/Weapon";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { cloneNewWeapon } from "../../common/WeaponsConfig";
import { WEAPON_FIST } from "../../common/WeaponsConfig";
import { BattleArena } from "./BattleArena";

export class Player
{
	public static readonly DEFAULT_MAX_HEALTH: number = 100;

	private readonly _index: number;
	protected readonly _color: number;

	protected _battleArena: BattleArena;
	protected _body3D: Body;

	protected _currHP: number;
	protected _maxHP: number;
	protected _isDead: boolean;

	protected _defaultFist: Weapon;
	protected _currWeapon: Weapon;
	protected _startWeaponCoolDownTime: number;

	public constructor(index: number)
	{
		this._index = index;
		this._color = 0xFFFFFF * Math.random();

		this._currHP = Player.DEFAULT_MAX_HEALTH;
		this._maxHP = Player.DEFAULT_MAX_HEALTH;
		this._isDead = false;

		this._defaultFist = cloneNewWeapon(WEAPON_FIST);
		this._currWeapon = this._defaultFist;
		this._startWeaponCoolDownTime = -1;
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
		if (this._currWeapon.isCoolDown && this._startWeaponCoolDownTime > 0)
		{
			if (Date.now() - this._startWeaponCoolDownTime >= this._currWeapon.coolDownSec * 1000)
			{
				this.resetWeaponCoolDown();
			}
		}
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
		if (this._isDead)
		{
			return;
		}

		this._currHP += delta;
		if (this._currHP > this._maxHP)
		{
			this._currHP = this._maxHP;
		}
		if (this._currHP <= 0)
		{
			this._isDead = true;
			this._currHP = 0;
		}
	}

	public attack(): void
	{
		if (this._isDead || this._currWeapon.isCoolDown)
		{
			return;
		}
		this._battleArena.startAttack(this);
		this.startWeaponCoolDown();
	}

	protected startWeaponCoolDown(): void
	{
		this._currWeapon.isCoolDown = true;
		this._startWeaponCoolDownTime = Date.now();
	}

	protected resetWeaponCoolDown(): void
	{
		this._currWeapon.isCoolDown = false;
		this._startWeaponCoolDownTime = -1;
	}

	public get index(): number
	{
		return this._index;
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
		return !this._isDead;
	}

	public get currWeapon(): Weapon
	{
		return this._currWeapon;
	}
}
