import { b2Vec2 } from "@box2d/core";
import { b2BodyType } from "@box2d/core";
import { b2Body } from "@box2d/core";
import { b2FixtureDef } from "@box2d/core";
import { XY } from "@box2d/core";
import { b2World } from "@box2d/core";
import { PlayerStateMap } from "../../common/data_types/PlayerStateMap";
import { WeaponType } from "../../common/data_types/WeaponType";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { SERVER_FRAME_RATE } from "../../common/GameConfig";
import { ServerApplication } from "../ServerApplication";
import { Player } from "./Player";

export class BattleArena
{
	private readonly _application: ServerApplication;
	private readonly _world: b2World;

	public constructor(application: ServerApplication)
	{
		this._application = application;
		this._world = b2World.Create({
			x: 0,
			y: 0
		});
	}

	public updateFrame(): void
	{
		this._world.Step(SERVER_FRAME_RATE, { positionIterations: 5, velocityIterations: 3 });
	}

	public createBody(type: b2BodyType, fixture: b2FixtureDef, position: XY): b2Body
	{
		const body = this._world.CreateBody({ type, position });

		body.SetSleepingAllowed(false);
		body.CreateFixture(fixture);

		return body;
	}

	public removeBody(body: b2Body): void
	{
		this._world.DestroyBody(body);
	}

	public getCurrentStateMap(): PlayerStateMap
	{
		const players: PlayerStateMap = {};

		for (const client of this._application.clients)
		{
			players[client.index] = client.player.getCurrentState();
		}

		return players;
	}

	public get world(): b2World
	{
		return this._world;
	}

	public playerAttacked(player: Player): void
	{
		switch (player.currWeapon.type)
		{
			case WeaponType.MELEE:
				this.handleMeleeAttack(player);
				break;
			case WeaponType.RANGED:
				this.handleRangedAttack(player);
				break;
		}
	}

	protected handleMeleeAttack(player: Player): void
	{
		// TODO: there is no direction of player yet, register damage by all range area around the player
		// TODO: implement weapon cool down
		const playerPos: Readonly<b2Vec2> = player.body.GetPosition();
		this._application.clients.forEach((client => {
			const clientPos: Readonly<b2Vec2> = client.player.body.GetPosition();
			if (clientPos.x === playerPos.x && clientPos.y === playerPos.y)
			{
				// Skip current player
			}
			else
			{
				const distance = Math.sqrt((clientPos.x - playerPos.x) ** 2 + (clientPos.y - playerPos.y) ** 2);
				if (distance < player.currWeapon.range + PLAYER_RADIUS)
				{
					this.registerHit(client.player, player.currWeapon.attack);
				}
			}
		}));
	}

	protected handleRangedAttack(player: Player): void
	{
		// TODO: implement range attack with collision checking
	}

	protected registerHit(player: Player, attack: number): void
	{
		// TODO: calculate damage considering armor
		const damage = attack;
		player.changeHP(-damage);
		console.log("DAMAGE DEAL: " + damage);

		// TODO: implement DEATH
	}
}
