import { LoopOnce } from "three";
import { AnimationMixer } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationAction } from "three/src/animation/AnimationAction";
import { LoopRepeat } from "three/src/constants";
import { Object3D } from "three/src/Three";

export class PlayerActionsAnimator
{
	private static readonly ANIMATION_NAMES: string[] = [ "breakdance", "dying", "idle", "jump", "pick_up", "punch", "receive_damage", "run", "throw" ];
	private _threeAnimationActions: AnimationAction[];
	private _mixer: AnimationMixer;

	constructor(cloneScene: Object3D, gltfModel: GLTF)
	{
		this.initAnimations(cloneScene, gltfModel);
	}

	private initAnimations(cloneScene: Object3D, gltfModel: GLTF): void
	{
		this._threeAnimationActions = [];

		this._mixer = new AnimationMixer(cloneScene);

		for (const anim of gltfModel.animations)
		{
			const action = this._mixer.clipAction(anim);
			action.setLoop(LoopOnce, 0);
			if (anim.name === PlayerActionsAnimator.ANIMATION_NAMES[7])
			{
				action.setLoop(LoopRepeat, 0);
			}
			if (anim.name === PlayerActionsAnimator.ANIMATION_NAMES[1])
			{
				action.clampWhenFinished = true;
			}
			this._threeAnimationActions.push(action);
		}
	}

	public updateMixer(delta: number): void
	{
		this._mixer.update(delta);
	}

	public punch(): void
	{
		this.playAnimation("punch");
	}

	public death(): void
	{
		this.playAnimation("dying");
	}

	public run(): void
	{
		this.playAnimation("run");
	}

	public receiveDamage(): void
	{
		this.playAnimation("receive_damage");
	}

	private playAnimation(name: string): void
	{
		const index = PlayerActionsAnimator.ANIMATION_NAMES.indexOf(name);
		const action = this._threeAnimationActions[index];
		if (!action.isRunning())
		{
			action.stop();
			action.play();
		}
	}
}