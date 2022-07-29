import { Body, ContactMaterial, GSSolver, Material, Plane, SplitSolver, World, Vec3 } from "cannon-es";
import { PlayerStateMap } from "../../common/data_types/PlayerStateMap";
import { WeaponType } from "../../common/data_types/WeaponType";
import { ATTACK_DELAY } from "../../common/GameConfig";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { ServerApplication } from "../ServerApplication";
import { Player } from "./Player";

interface AttackInfo
{
	attackedPlayer: Player,
	delaySec: number,
	startTime: number
}

export class BattleArena
{
	protected readonly _application: ServerApplication;
	protected readonly _world: World;
	protected _physicsMaterial: Material;

	protected _attacksPool: AttackInfo[];

	public constructor(application: ServerApplication)
	{
		this._application = application;

		this._world = new World();

		this._attacksPool = [];

		this.initWorld();
		this.initMap();
	}

	public updateFrame(): void
	{
		this._world.fixedStep();
		this.checkAttackStarting();
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

	public startAttack(player: Player): void
	{
		this._attacksPool.push({
			attackedPlayer: player,
			startTime: Date.now(),
			delaySec: ATTACK_DELAY
		});
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
		this._physicsMaterial = new Material("physics");
		const physics_physics = new ContactMaterial(this._physicsMaterial, this._physicsMaterial, {
			friction: 0.0,
			restitution: 0.3
		});
		this._world.addContactMaterial(physics_physics);
	}

	protected initMap(): void
	{
		// create ground plane
		const groundShape = new Plane();
		const groundBody = new Body({ mass: 0, material: this._physicsMaterial });
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		this._world.addBody(groundBody);
	}

	protected checkAttackStarting(): void
	{
		const now = Date.now();
		this._attacksPool = this._attacksPool.filter(info => {
			if (now - info.startTime > info.delaySec * 1000)
			{
				switch (info.attackedPlayer.currWeapon.type)
				{
					case WeaponType.MELEE:
						this.handleMeleeAttack(info.attackedPlayer);
						break;
					case WeaponType.RANGED:
						this.handleRangedAttack(info.attackedPlayer);
						break;
				}
				return false;
			}
			return true;
		});
	}

	protected handleMeleeAttack(player: Player): void
	{
		// TODO: there is no direction of player yet, register damage by all range area around the player
		const playerPos: Vec3 = player.body.position;
		this._application.clients.forEach((client => {
			const clientPos: Vec3 = client.player.body.position;
			if (clientPos.x === playerPos.x && clientPos.y === playerPos.y && clientPos.z === playerPos.z)
			{
				// Skip current player
			}
			else
			{
				const distance = Math.sqrt((clientPos.x - playerPos.x) ** 2 + (clientPos.z - playerPos.z) ** 2);
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
	}
}
