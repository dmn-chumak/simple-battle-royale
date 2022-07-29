import { TextStyle } from "pixi.js";
import { Text } from "pixi.js";
import { Container } from "pixi.js";

export class HealthPanelView extends Container
{
	private _healthText: Text;
	private _healthTextStyle: TextStyle;
	private _deathText: Text;

	constructor()
	{
		super();
		this.initParams();
	}

	private initParams(): void
	{
		this._healthTextStyle = new TextStyle({
			fill: "#ff4242",
			fontSize: 25,
			fontStyle: "italic",
			fontWeight: "bold"
		});
		this._healthText = new Text("Health:", this._healthTextStyle);
		this.addChild(this._healthText);

		const deathTextStyle = new TextStyle({
			fill: "#ff4242",
			fontSize: 75,
			fontWeight: "bold"
		});
		this._deathText = new Text("", deathTextStyle);
		this._deathText.y = 700;
		this.addChild(this._deathText);
	}

	public updateHealthText(total: number, current: number)
	{
		const healthText = `Health: ${current} / ${total}`
		this._healthText.text = healthText;
	}

	public updateDeathText()
	{
		const healthText = "You are dead!";
		this._deathText.text = healthText;
	}
}