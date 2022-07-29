import { Ticker } from "pixi.js";
import { Renderer } from "pixi.js";
import { Fog } from "three";
import { PCFSoftShadowMap } from "three";
import { sRGBEncoding } from "three";
import { ACESFilmicToneMapping } from "three";
import { Camera } from "three";
import { WebGLRenderer } from "three";
import { PerspectiveCamera } from "three";
import { Scene } from "three";

import { ClientOutcomeMessageType } from "../common/ClientOutcomeMessageType";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { LoaderScene } from "./common_scenes/LoaderScene";
import { ResourceManager } from "./ResourceManager";
import { SceneManager } from "./SceneManager";

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
		const context = canvas.getContext("webgl2", {depth: true, antialias: true, stencil: true});
		document.body.appendChild(canvas);

		this._resourceManager = ResourceManager.getInstance();

		this._threeRenderer = new WebGLRenderer({context, canvas, logarithmicDepthBuffer: true});
		this._threeScene = new Scene();
		this._threeCamera = new PerspectiveCamera(75, this.aspectRatio, 0.1, 1000);

		this._threeScene.fog = new Fog(0x000000, 0, 500);

		this._threeRenderer.physicallyCorrectLights = true;
		this._threeRenderer.shadowMap.autoUpdate = true;
		this._threeRenderer.shadowMap.type = PCFSoftShadowMap;
		this._threeRenderer.shadowMap.enabled = true;
		this._threeRenderer.toneMapping = ACESFilmicToneMapping;
		this._threeRenderer.toneMappingExposure = 1.0;
		this._threeRenderer.outputEncoding = sRGBEncoding;
		this._threeRenderer.setClearColor(this._threeScene.fog.color);

		this._pixiRenderer = new Renderer({context, view: canvas});
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
		this._pixiRenderer.render(this._pixiSceneManager, {clear: false});
	};

	private resizeApplication = () =>
	{
		const {innerWidth, innerHeight} = window;

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

	public get canvas(): HTMLCanvasElement
	{
		return this._threeRenderer.domElement;
	}
}
