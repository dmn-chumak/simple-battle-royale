import { Object3D } from "three";
import { AnimationAction } from "three/src/animation/AnimationAction";
import { clone as cloneSkeletone } from "three/examples/jsm/utils/SkeletonUtils";
import { PlayerType } from "../../common/data_types/PlayerType";
import { Weapon } from "../../common/data_types/Weapon";
import { ResourceManager } from "../ResourceManager";
import { PlayerActionsAnimator } from "./animators/PlayerActionsAnimator";

export class PlayerView extends Object3D
{
	private static readonly ANIMATION_NAMES: string[] = [ "breakdance", "dying", "idle", "jump", "pick_up", "punch", "receive_damage", "run", "throw" ];
	private _threeAnimationActions: AnimationAction[];
	private _currHp: number;
	private _maxHp: number;
	private _isAlive: boolean;
	private _weaponInfo: Weapon;
	private _animator: PlayerActionsAnimator;

	public constructor(type: PlayerType)
	{
		super();

		// const circle = new Mesh(new SphereGeometry(PLAYER_RADIUS), new MeshLambertMaterial({color}));
		// circle.castShadow = true;
		// circle.receiveShadow = true;
		// this.add(circle);

		this._isAlive = true;

		this._threeAnimationActions = [];

		const resourceManager = ResourceManager.getInstance();
		const gltfModel = resourceManager.obtainGLTFObject(type);
		const cloneScene = cloneSkeletone(gltfModel.scene);
		this.add(cloneScene);

		this._animator = new PlayerActionsAnimator(cloneScene, gltfModel);
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

	public get isAlive(): boolean
	{
		return this._isAlive;
	}

	public set isAlive(isAlive: boolean)
	{
		this._isAlive = isAlive;
	}

	public get weaponInfo(): Weapon
	{
		return this._weaponInfo;
	}

	public set weaponInfo(value: Weapon)
	{
		this._weaponInfo = value;
	}

	public punch(): void
	{
		if (this._isAlive)
		{
			this._animator.punch();
		}
	}

	public death(): void
	{
		this._animator.death();
	}

	public run(): void
	{
		if (this._isAlive)
		{
			this._animator.run();
		}
	}

	public stopRun(): void
	{
		if (this._isAlive)
		{
			this._animator.stopRun();
		}
	}

	public receiveDamage(): void
	{
		if (this._isAlive)
		{
			this._animator.receiveDamage();
		}
	}

	public updateMixer(delta: number): void
	{
		this._animator.updateMixer(delta);
	}

	private playAnimation(name: string): void
	{
		const index = PlayerView.ANIMATION_NAMES.indexOf(name);
		const action = this._threeAnimationActions[index];
		action.stop();
		action.play();
	}

	public checkRunningAnimations(): void
	{

	}
}
