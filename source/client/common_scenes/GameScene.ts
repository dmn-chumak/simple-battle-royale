import { PMREMGenerator } from "three";
import { Vector3 } from "three";
import { AmbientLight } from "three";

import { CommandMessageDecoder } from "../../common/CommandMessageDecoder";
import { CommandType } from "../../common/CommandType";
import { IItemData } from "../../common/data_types/IItemData";
import { PlayerState } from "../../common/data_types/PlayerState";
import { BattleArenaView } from "../battle/BattleArenaView";
import { MovablePlayerView } from "../battle/MovablePlayerView";
import { PlayerInventoryView } from "../battle/PlayerInventoryView";
import { PlayerView } from "../battle/PlayerView";
import { PlayerViewMap } from "../battle/PlayerViewMap";
import { HealthPanelView } from "../healthPanel/HealthPanelView";
import { SceneManager } from "../SceneManager";
import { COMMAND_FACTORY } from "../types/ClientCommandFactory";
import { SceneUtils } from "../utils/SceneUtils";
import { Scene } from "./Scene";

export class GameScene extends Scene
{
	private readonly _playersMap: PlayerViewMap;
	private readonly _battleArena: BattleArenaView;
	private readonly _inventory: PlayerInventoryView;
	private _player: MovablePlayerView;
	private _healthPanelView: HealthPanelView;

	public constructor()
	{
		super();

		this._battleArena = new BattleArenaView();
		this._healthPanelView = new HealthPanelView();
		this._inventory = new PlayerInventoryView();
		this._playersMap = {};
		this._player = null;
	}

	public override start(manager: SceneManager): void
	{
		super.start(manager);

		const { resourceManager, threeScene, socket } = manager.application;

		const evnTexture = resourceManager.obtainThreeTexture("env");
		const pmremGenerator = new PMREMGenerator(manager.application.threeRenderer);
		pmremGenerator.compileEquirectangularShader();
		const pmremData = pmremGenerator.fromEquirectangular(evnTexture);

		threeScene.background = pmremData.texture;
		threeScene.environment = pmremData.texture;
		threeScene.add(this._battleArena);

		document.body.onclick = () =>
		{
			this.playerAttack();
		};

		threeScene.add(SceneUtils.createFloor());
		threeScene.add(new AmbientLight(0xFFFFFF, 0.1));
		threeScene.add(SceneUtils.createSpotlight(0xFFFFFF, new Vector3(2, 5, 2), new Vector3(0, 0, 0)));

		//this._camera.position.set(0, 6, 18);

		this.addChild(this._healthPanelView);
		this.addChild(this._inventory);

		socket.onmessage = (event) =>
		{
			const message = CommandMessageDecoder.decode(event.data);
			const commandType = COMMAND_FACTORY[message.type];
			const command = new commandType(message, this);

			command.execute();
		};
	}

	public override update(delta: number): void
	{
		for (const key in this._playersMap)
		{
			this._playersMap[key].updateMixer(0.05);
		}

		if (this._player)
		{
			this._player.update();
		}
	}

	public updateCamera(): void
	{
		const { threeCamera } = this._manager.application;

		const offset = 6;
		const height = 5;

		threeCamera.position.x = this._player.position.x - Math.sin(this._player.rotation.y) * offset;
		threeCamera.position.z = this._player.position.z - Math.cos(this._player.rotation.y) * offset;
		threeCamera.position.y = this._player.position.y + height;

		threeCamera.lookAt(this._player.position);
	}

	public override stop(): void
	{
		this._battleArena.removeFromParent();

		super.stop();
	}

	public appendPlayer(player: PlayerView, index: number, state: PlayerState): void
	{
		this._battleArena.add(player);
		this._playersMap[index] = player;

		player.position.x = state.x;
		player.position.y = state.y;
		player.position.z = state.z;
	}

	public removePlayer(player: PlayerView, index: number): void
	{
		this._battleArena.remove(player);
		delete this._playersMap[index];
	}

	public get playersMap(): PlayerViewMap
	{
		return this._playersMap;
	}

	public get battleArena(): BattleArenaView
	{
		return this._battleArena;
	}

	public set player(value: MovablePlayerView)
	{
		this._player = value;
	}

	public get player(): MovablePlayerView
	{
		return this._player;
	}

	public updateHealthValue(): void
	{
		this._healthPanelView.updateHealthText(this._player.maxHp, this._player.currHp);
	}

	public updateDeathText(): void
	{
		this._healthPanelView.updateDeathText();
	}

	public override resize(): void
	{
		this._healthPanelView.x = 500;
		this._inventory.resize();
	}

	public addItemsToInventory(items: IItemData[]): void
	{
		this._inventory.addItems(items);
	}

	protected playerAttack(): void
	{
		if (this._player.isAlive && !this._player.weaponInfo.isCoolDown)
		{
			this._manager.application.sendMessage({
				type: CommandType.CL_ATTACK,
				data: {}
			});
			this._player.punch();
		}
	}
}
