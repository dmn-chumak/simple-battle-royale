import { Container } from "pixi.js";
import { SceneManager } from "../SceneManager";

export class Scene extends Container
{
	protected _manager: SceneManager;

	public constructor()
	{
		super();
	}

	public get manager(): SceneManager
	{
		return this._manager;
	}

	public start(manager: SceneManager): void
	{
		this._manager = manager;
	}

	public update(delta: number): void
	{
		// empty
	}

	public resize(): void
	{
		// empty
	}

	public stop(): void
	{
		this._manager = null;
	}
}
