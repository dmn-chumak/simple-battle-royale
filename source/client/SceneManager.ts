import { Container } from "pixi.js";
import { ClientApplication } from "./ClientApplication";
import { Scene } from "./common_scenes/Scene";

export class SceneManager extends Container
{
	protected readonly _application: ClientApplication;
	protected _scene: Scene;

	public constructor(application: ClientApplication)
	{
		super();

		this._application = application;
		this._scene = null;
	}

	public changeScene(scene: Scene): void
	{
		if (this._scene)
		{
			this.removeChild(this._scene);
			this._scene.stop();
			this._scene = null;
		}

		this._scene = scene;

		if (this._scene)
		{
			this.addChild(this._scene);
			this._scene.start(this);
		}
	}

	public updateScene(delta: number): void
	{
		if (this._scene)
		{
			this._scene.update(delta);
		}
	}

	public resizeScene(): void
	{
		if (this._scene)
		{
			this._scene.resize();
		}
	}

	public get application(): ClientApplication
	{
		return this._application;
	}

	public get scene(): Scene
	{
		return this._scene;
	}
}
