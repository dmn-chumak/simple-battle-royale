import { Sound } from "@pixi/sound";
import { SoundLoader } from "@pixi/sound";
import { Loader } from "pixi.js";
import { Group } from "three";
import { Texture } from "three";
import { TextureLoader } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface ThreeQueueItem
{
	name: string;
	loader: GLTFLoader | TextureLoader;
	path: string;
}

interface ThreeResourceCache<Type>
{
	[name: string]: Type;
}

export class ResourceManager
{
	private _progressCallback: (progress: number) => void;
	private _completeCallback: () => void;

	private readonly _threeTextureCache: ThreeResourceCache<Texture>;
	private readonly _threeModelCache: ThreeResourceCache<GLTF>;

	private readonly _threeTextureLoader: TextureLoader;
	private readonly _threeGLTFLoader: GLTFLoader;
	private readonly _pixiLoader: Loader;

	private _threeTotalItems: number;
	private _threeLoaderQueue: ThreeQueueItem[];
	private _pixiLoadedItems: number;
	private _pixiTotalItems: number;

	public constructor()
	{
		this._threeTextureLoader = new TextureLoader();
		this._threeGLTFLoader = new GLTFLoader();

		this._pixiLoader = Loader.shared;
		this._pixiLoader.onProgress.add(this.pixiLoadProgressHandler);
		this._pixiLoader.onLoad.add(this.pixiLoadHandler);
		SoundLoader.add();

		this._threeTextureCache = {};
		this._threeModelCache = {};

		this._threeTotalItems = 0;
		this._threeLoaderQueue = [];
		this._pixiTotalItems = 0;
	}

	private pixiLoadProgressHandler = () =>
	{
		if (this._progressCallback)
		{
			const pixiResourcePart = this._pixiTotalItems / (this._pixiTotalItems + this._threeTotalItems);
			this._progressCallback((this._pixiLoader.progress / 100) * pixiResourcePart);
		}
	};

	private pixiLoadHandler = () =>
	{
		if (++this._pixiLoadedItems === this._pixiTotalItems)
		{
			this.pixiLoadCompleteHandler();
		}
	};

	private pixiLoadCompleteHandler = async () =>
	{
		const threeResourcePart = this._threeTotalItems / (this._pixiTotalItems + this._threeTotalItems);
		const pixiResourcePart = 1.0 - threeResourcePart;

		for (let index = 0; index < this._threeTotalItems; index++)
		{
			const { name, loader, path } = this._threeLoaderQueue[index];
			const resource = await loader.loadAsync(path);

			if (loader === this._threeTextureLoader)
			{
				this._threeTextureCache[name] = resource as Texture;
			}
			else
			{
				this._threeModelCache[name] = resource as GLTF;
			}

			if (this._progressCallback)
			{
				this._progressCallback(((index + 1) / this._threeTotalItems) * threeResourcePart + pixiResourcePart);
			}
		}

		this._threeTotalItems = 0;
		this._threeLoaderQueue = [];
		this._pixiTotalItems = 0;

		if (this._completeCallback)
		{
			this._completeCallback();
		}
	};

	public registerPixiSprite(name: string, path: string): void
	{
		this._pixiLoader.add(name, path);
		this._pixiTotalItems++;
	}

	public registerThreeTexture(name: string, path: string): void
	{
		this._threeLoaderQueue.push({ name, path, loader: this._threeTextureLoader });
		this._threeTotalItems++;
	}

	public registerThreeModel(name: string, path: string): void
	{
		this._threeLoaderQueue.push({ name, path, loader: this._threeGLTFLoader });
		this._threeTotalItems++;
	}

	public registerSound(name: string, path: string): void
	{
		this._pixiLoader.add(name, path);
		this._pixiTotalItems++;
	}

	public obtainThreeTexture(name: string): Texture
	{
		return this._threeTextureCache[name];
	}

	public obtainThreeModel(name: string): Group
	{
		return this._threeModelCache[name].scene;
	}

	public obtainSound(name: string): Sound
	{
		return this._pixiLoader.resources[name].sound;
	}

	public set progressCallback(value: (progress: number) => void)
	{
		this._progressCallback = value;
	}

	public set completeCallback(value: () => void)
	{
		this._completeCallback = value;
	}

	public loadResources(): void
	{
		if (this._pixiTotalItems === 0)
		{
			this.pixiLoadCompleteHandler();
			return;
		}

		this._pixiLoadedItems = 0;
		this._pixiLoader.load();
	}
}