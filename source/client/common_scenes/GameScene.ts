import { CommandMessageDecoder } from "../../common/CommandMessageDecoder";
import { PlayerState } from "../../common/data_types/PlayerState";
import { BattleArenaView } from "../battle/BattleArenaView";
import { MovablePlayerView } from "../battle/MovablePlayerView";
import { PlayerView } from "../battle/PlayerView";
import { PlayerViewMap } from "../battle/PlayerViewMap";
import { SceneManager } from "../SceneManager";
import { COMMAND_FACTORY } from "../types/ClientCommandFactory";
import { Scene } from "./Scene";

export class GameScene extends Scene
{
	private readonly _playersMap: PlayerViewMap;
	private readonly _battleArena: BattleArenaView;
	private _player: MovablePlayerView;

	public constructor()
	{
		super();

		this._battleArena = new BattleArenaView();
		this.addChild(this._battleArena);

		this._playersMap = {};
		this._player = null;
	}

	public override start(manager: SceneManager): void
	{
		super.start(manager);

		manager.application.socket.onmessage = (event) =>
		{
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

	public appendPlayer(player: PlayerView, index: number, state: PlayerState): void
	{
		this._battleArena.addChild(player);
		this._playersMap[index] = player;

		player.x = state.x;
		player.y = state.y;
	}

	public removePlayer(player: PlayerView, index: number): void
	{
		this._battleArena.removeChild(player);
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
}
