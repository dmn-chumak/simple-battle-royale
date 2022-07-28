import { Sprite } from "pixi.js";
import { Euler } from "three";
import { Vector3 } from "three";
import { AmbientLight } from "three";
import { CommandMessageDecoder } from "../../common/CommandMessageDecoder";
import { CommandType } from "../../common/CommandType";
import { PlayerState } from "../../common/data_types/PlayerState";
import { PLAYER_RADIUS } from "../../common/GameConfig";
import { BattleArenaView } from "../battle/BattleArenaView";
import { MovablePlayerView } from "../battle/MovablePlayerView";
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
	private _player: MovablePlayerView;
	private _healthPanelView: HealthPanelView

	public constructor()
	{
		super();

		this._battleArena = new BattleArenaView();
		this._healthPanelView = new HealthPanelView();
		this._playersMap = {};
		this._player = null;
	}

	public override start(manager: SceneManager): void
	{
		super.start(manager);

		const { resourceManager, threeScene, threeCamera, socket } = manager.application;

		threeScene.add(this._battleArena);
		threeScene.add(SceneUtils.createPlane(0xCCCCCC, new Vector3(0, -PLAYER_RADIUS, 0), new Euler(-Math.PI / 2, 0, 0, "XYZ")));
		threeScene.add(new AmbientLight(0xFFFFFF, 0.35));
		threeScene.add(SceneUtils.createLight(0xFFFFFF, new Vector3(0, 5, 0)));
		this.addChild(this._healthPanelView)

		{
			// examples of using resources, loaded from resource manager

			threeScene.add(resourceManager.obtainThreeModel("model"));
			this.addChild(Sprite.from("sprite"));

			document.body.onclick = () => {
				//resourceManager.obtainSound("sound").play();
				this._manager.application.sendMessage({
					type: CommandType.CL_ATTACK,
					data: {}
				});
			};
		}

		threeCamera.position.set(0, 15, 0);
		threeCamera.lookAt(0, 0, 0);

		socket.onmessage = (event) => {
			const message = CommandMessageDecoder.decode(event.data);
			const commandType = COMMAND_FACTORY[message.type];
			const command = new commandType(message, this);

			command.execute();
		};
	}

	public override update(delta: number): void
	{
		if (this._player)
		{
			this._player.update();
		}
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
		player.position.z = state.y;
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

	public override resize(): void
	{
		this._healthPanelView.x = 500;
	}
}
