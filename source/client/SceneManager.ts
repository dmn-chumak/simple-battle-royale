import { Application, Container } from "pixi.js";
import { Scene } from "./Scene";

export class SceneManager extends Container
{
	private readonly _application: Application;
	private _scene: Scene;
	private _socket: WebSocket;

	public constructor(application: Application)
	{
		super();

		this._application = application;
		this._application.stage.addChild(this);
		this._application.ticker.add(
			(delta: number) =>
			{
				this.updateScene(delta);
			}
		);
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

	public get application(): Application
	{
		return this._application;
	}

	public set socket(value: WebSocket)
	{
		this._socket = value;
	}

	public get socket(): WebSocket
	{
		return this._socket;
	}
}
