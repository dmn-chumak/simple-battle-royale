import { b2BodyType } from "@box2d/core";
import { b2Body } from "@box2d/core";
import { b2FixtureDef } from "@box2d/core";
import { XY } from "@box2d/core";
import { b2World } from "@box2d/core";
import { PlayerStateMap } from "../../common/data_types/PlayerStateMap";
import { SERVER_FRAME_RATE } from "../../common/GameConfig";
import { ServerApplication } from "../ServerApplication";

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
}
