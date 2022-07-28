import { Camera } from "three";
import { Euler } from "three";
import { Vector3 } from "three";
import { Quaternion } from "three";
import { Object3D } from "three";

export class Camera3rdPerson
{
	public get enabled(): boolean
	{
		return this._enabled;
	}

	public set enabled(val: boolean)
	{
		this._enabled = val;
	}

	public get isLocked(): boolean
	{
		return this._isLocked;
	}

	protected _enabled: boolean = false;
	protected _pitchObject: Object3D;
	protected _yawObject: Object3D;
	protected _quaternion: Quaternion;
	protected _isLocked: boolean;
	protected _euler: Euler;
	protected _follow: Object3D = null;

	protected _onMouseMoveBound: (event: MouseEvent) => void;
	protected _onPointerlockChangeBound: () => void;
	protected _onPointerlockErrorBound: () => void;

	constructor(camera: Camera)
	{
		this._pitchObject = new Object3D();
		this._pitchObject.add(camera);

		this._yawObject = new Object3D();
		this._yawObject.position.y = 10;
		this._yawObject.add(this._pitchObject);

		this._quaternion = new Quaternion();
		this._euler = new Euler();

		this._onMouseMoveBound = this.onMouseMove.bind(this);
		this._onPointerlockChangeBound = this.onPointerlockChange.bind(this);
		this._onPointerlockErrorBound = this.onPointerlockError.bind(this);

		this.connect();
	}

	protected connect(): void
	{
		document.addEventListener('mousemove', this._onMouseMoveBound);
		document.addEventListener('pointerlockchange', this._onPointerlockChangeBound);
		document.addEventListener('pointerlockerror', this._onPointerlockErrorBound);
	}

	protected disconnect(): void
	{
		document.removeEventListener('mousemove', this._onMouseMoveBound);
		document.removeEventListener('pointerlockchange', this._onPointerlockChangeBound);
		document.removeEventListener('pointerlockerror', this._onPointerlockErrorBound);
	}

	public dispose(): void
	{
		this.disconnect();
		this._follow = null;
	}

	public lock(): void
	{
		document.body.requestPointerLock();
	}

	public unlock(): void
	{
		document.exitPointerLock();
	}

	public getObject(): Object3D
	{
		return this._yawObject;
	}

	public getDirection(): Vector3
	{
		const vector = new Vector3(0, 0, -1);
		vector.applyQuaternion(this._quaternion);

		return vector;
	}

	public update(): void
	{
		if (this._enabled === false)
		{
			return;
		}

		this._euler.x = this._pitchObject.rotation.x;
		this._euler.y = this._yawObject.rotation.y;
		this._euler.order = 'XYZ';
		this._quaternion.setFromEuler(this._euler);

		if (this._follow)
		{
			const playerPos = this._follow.position.clone();
			playerPos.y += 1;
			playerPos.z += 1;
			this._yawObject.position.copy(playerPos);
		}
	}

	protected onPointerlockChange(): void
	{
		if (document.pointerLockElement)
		{
			//this.dispatchEvent(this.lockEvent)
			this._isLocked = true;
		}
		else
		{
			//this.dispatchEvent(this.unlockEvent)
			this._isLocked = false;
		}
	}

	protected onPointerlockError(): void
	{
		console.error('PointerLockControlsCannon: Unable to use Pointer Lock API')
	}

	protected onMouseMove(event: MouseEvent)
	{
		if (!this._enabled)
		{
			return;
		}

		const {movementX, movementY} = event;

		this._yawObject.rotation.y -= movementX * 0.002;
		this._pitchObject.rotation.x -= movementY * 0.002;

		this._pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this._pitchObject.rotation.x));
	}

	public follow(player: Object3D): void
	{
		this._follow = player;
	}
}
