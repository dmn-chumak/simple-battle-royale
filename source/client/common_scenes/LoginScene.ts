import { LoginPanel } from "../login/LoginPanel";
import { SceneManager } from "../SceneManager";
import { GameServerConnectScene } from "./GameServerConnectScene";
import { Scene } from "./Scene";

export class LoginScene extends Scene
{
	protected _loginPanel: LoginPanel;

	constructor()
	{
		super();

		this._loginPanel = new LoginPanel(this.onLogin.bind(this));
	}

	public override start(manager: SceneManager): void
	{
		super.start(manager);
		this._loginPanel.show();
	}

	public override stop(): void
	{
		super.stop();
		this._loginPanel.hide();
	}

	protected onLogin(login: string, pass: string): void
	{
		this._loginPanel.enable(false);
		fetch("/auth", {
			method: "POST",
			body: JSON.stringify({
				login,
				pass
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then((res) => {
			console.log(res);
			if (res.status === 200)
			{
				this._manager.changeScene(new GameServerConnectScene(login));
			}
			else
			{
				this._loginPanel.loginError("Incorrect password!");
				this._loginPanel.enable(true);
			}
		});
	}
}