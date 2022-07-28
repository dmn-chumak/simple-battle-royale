import { Body, ContactMaterial, GSSolver, Material, Plane, SplitSolver, World } from 'cannon-es';

import { PlayerStateMap } from "../../common/data_types/PlayerStateMap";
import { ServerApplication } from "../ServerApplication";

export class BattleArena
{
	protected readonly _application: ServerApplication;
	protected readonly _world: World;
	protected _physicsMaterial: Material;

	public constructor(application: ServerApplication)
	{
		this._application = application;

		this._world = new World();

		this.initWorld();
		this.initMap();
	}

	public updateFrame(): void
	{
		this._world.fixedStep();
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

	public addPlayer(playerBody: Body): void
	{
		playerBody.material = this._physicsMaterial;
		this._world.addBody(playerBody);
	}

	public removePlayer(playerBody: Body): void
	{
		this._world.removeBody(playerBody);
	}

	protected initWorld(): void
	{
		// Tweak contact properties.
		// Contact stiffness - use to make softer/harder contacts
		this._world.defaultContactMaterial.contactEquationStiffness = 1e9;
		// Stabilization time in number of timesteps
		this._world.defaultContactMaterial.contactEquationRelaxation = 4;

		const solver = new GSSolver();
		solver.iterations = 7;
		solver.tolerance = 0.1;
		this._world.solver = new SplitSolver(solver);

		// gravity m/s²
		this._world.gravity.set(0, -9.82, 0);

		// Create a slippery material (friction coefficient = 0.0)
		this._physicsMaterial = new Material('physics');
		const physics_physics = new ContactMaterial(this._physicsMaterial, this._physicsMaterial, {
			friction: 0.0,
			restitution: 0.3,
		});
		this._world.addContactMaterial(physics_physics);
	}

	protected initMap(): void
	{
		// create ground plane
		const groundShape = new Plane();
		const groundBody = new Body({mass: 0, material: this._physicsMaterial});
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		this._world.addBody(groundBody);
	}
}
