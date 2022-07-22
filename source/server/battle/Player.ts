import { b2BodyType } from "@box2d/core";
import { b2CircleShape } from "@box2d/core";
import { b2Body } from "@box2d/core";
import { PlayerState } from "../../common/data_types/PlayerState";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { BattleArena } from "./BattleArena";

export class Player
{
	private readonly _color: number;

	private _battleArena: BattleArena;
	private _body: b2Body;

	public constructor()
	{
		this._color = 0xFFFFFF * Math.random();
	}

	public enterBattleArena(battleArena: BattleArena): void
	{
		this._battleArena = battleArena;

		this._body = battleArena.createBody(
			b2BodyType.b2_dynamicBody,
			{
				shape: new b2CircleShape(PLAYER_RADIUS),
				friction: 0.75,
				density: 3
			},
			{
				x: 1 + 5 * Math.random(),
				y: 1 + 5 * Math.random()
			}
		);
	}

	public leaveBattleArena(): void
	{
		this._battleArena.removeBody(this._body);
		this._battleArena = null;

		this._body = null;
	}

	public beforeUpdateFrame(): void
	{
		this._body.SetLinearVelocity({ x: 0, y: 0 });
	}

	public updateFrame(): void
	{
		// empty
	}

	public getCurrentState(): PlayerState
	{
		const position = this._body.GetPosition();

		return {
			color: this._color,
			x: position.x,
			y: position.y
		};
	}

	public get color(): number
	{
		return this._color;
	}

	public get body(): b2Body
	{
		return this._body;
	}
}
