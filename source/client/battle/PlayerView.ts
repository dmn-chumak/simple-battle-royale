import { SphereGeometry } from "three";
import { MeshLambertMaterial } from "three";
import { Mesh } from "three";
import { LoopOnce } from "three";
import { AnimationMixer } from "three";
import { Object3D } from "three";
import { AnimationAction } from "three/src/animation/AnimationAction";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { ResourceManager } from "../ResourceManager";

export class PlayerView extends Object3D
{
	private static readonly ANIMATION_NAMES: string[] = [ "breakdance", "dying", "jump", "pick_up", "punch", "run", "throw" ];
	private _threeAnimationActions: AnimationAction[];
	private _currHp: number;
	private _maxHp: number;
	private _action: AnimationAction;
	private _mixer: AnimationMixer;
	private _isAlive: boolean;

	public constructor(color: number)
	{
		super();

		const circle = new Mesh(new SphereGeometry(PLAYER_RADIUS), new MeshLambertMaterial({color}));
		circle.castShadow = true;
		circle.receiveShadow = true;
		this.add(circle);

		this._isAlive = true;

		this._threeAnimationActions = [];

		const resourceManager = ResourceManager.getInstance();
		const gltfModel = resourceManager.obtainGLTFObject("cigarGuy");

		const cloneScene = gltfModel.scene.clone(true);

		console.log("gltfModel.scene ",gltfModel.scene)
		console.log("cloneScene ",cloneScene)

		// this.add(cloneScene);

		this._mixer = new AnimationMixer(cloneScene);

		for (const anim of gltfModel.animations)
		{
			const action = this._mixer.clipAction(anim);
			action.setLoop(LoopOnce, 0);
			this._threeAnimationActions.push(action);
		}
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

	public punch(): void
	{
		if (this._isAlive)
		{
			this.playAnimation("punch");
		}
	}

	public death(): void
	{
		this.playAnimation("dying");
	}

	public run(): void
	{
		if (this._isAlive)
		{
			this.playAnimation("run");
		}
	}

	public updateMixer(delta: number): void
	{
		this._mixer.update(delta);
	}

	private playAnimation(name: string): void
	{
		const index = PlayerView.ANIMATION_NAMES.indexOf(name);
		const action = this._threeAnimationActions[index];
		if (!action.isRunning())
		{
			action.stop();
			action.play();
		}
	}
}
