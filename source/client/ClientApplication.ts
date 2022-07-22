import { Ticker } from "pixi.js";
import { Renderer } from "pixi.js";
import { Camera } from "three";
import { WebGLRenderer } from "three";
import { PerspectiveCamera } from "three";
import { Scene } from "three";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { LoaderScene } from "./common_scenes/LoaderScene";
import { ResourceManager } from "./ResourceManager";
import { SceneManager } from "./SceneManager";
import { ClientOutcomeMessageType } from "./types/ClientOutcomeMessageType";

export class ClientApplication
{
	private readonly _resourceManager: ResourceManager;

	private readonly _threeRenderer: WebGLRenderer;
	private readonly _threeScene: Scene;
	private readonly _threeCamera: PerspectiveCamera;

	private readonly _pixiRenderer: Renderer;
	private readonly _pixiSceneManager: SceneManager;
	private readonly _pixiTicker: Ticker;

	private _socket: WebSocket;

	public constructor()
	{
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("webgl2", { depth: true, antialias: true, stencil: true });
		document.body.appendChild(canvas);

		this._resourceManager = new ResourceManager();

		this._threeRenderer = new WebGLRenderer({ context, canvas });
		this._threeScene = new Scene();
		this._threeCamera = new PerspectiveCamera(45, this.aspectRatio, 0.1, 1000);

		this._pixiRenderer = new Renderer({ context, view: canvas });
		this._pixiSceneManager = new SceneManager(this);
		this._pixiSceneManager.changeScene(new LoaderScene());

		window.addEventListener("resize", this.resizeApplication);
		this.resizeApplication();

		this._pixiTicker = new Ticker();
		this._pixiTicker.add(this.updateApplication);
		this._pixiTicker.start();
	}

	private updateApplication = (delta: number) =>
	{
		this._pixiSceneManager.updateScene(delta);

		this._threeRenderer.clear(true, true, true);
		this._threeRenderer.resetState();
		this._threeRenderer.render(this._threeScene, this._threeCamera);

		this._pixiRenderer.reset();
		this._pixiRenderer.render(this._pixiSceneManager, { clear: false });
	};

	private resizeApplication = () =>
	{
		const { innerWidth, innerHeight } = window;

		this._threeCamera.aspect = this.aspectRatio;
		this._threeCamera.updateProjectionMatrix();
		this._threeRenderer.setSize(innerWidth, innerHeight);
		this._pixiRenderer.resize(innerWidth, innerHeight);

		this._pixiSceneManager.resizeScene();
	};

	public sendMessage(message: ClientOutcomeMessageType): void
	{
		if (this._socket)
		{
			this._socket.send(CommandMessageEncoder.encode(message));
		}
	}

	public get resourceManager(): ResourceManager
	{
		return this._resourceManager;
	}

	public get aspectRatio(): number
	{
		return window.innerWidth / window.innerHeight;
	}

	public get pixiSceneManager(): SceneManager
	{
		return this._pixiSceneManager;
	}

	public get threeScene(): Scene
	{
		return this._threeScene;
	}

	public get threeCamera(): Camera
	{
		return this._threeCamera;
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
