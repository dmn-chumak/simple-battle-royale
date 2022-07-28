import { TextStyle } from "pixi.js";
import { Text } from "pixi.js";
import { Container } from "pixi.js";

export class HealthPanelView extends Container
{
	private healthText: Text;
	private healthTextStyle: TextStyle;

	constructor()
	{
		super();
		this.initParams();
	}

	private initParams(): void
	{
		this.healthTextStyle = new TextStyle({
			fill: "#ff4242",
			fontSize: 25,
			fontStyle: "italic",
			fontWeight: "bold"
		});
		this.healthText = new Text("Health:", this.healthTextStyle);
		this.addChild(this.healthText);
	}

	public updateHealthText(total: number, current: number)
	{
		const healthText = `Health: ${current} / ${total}`
		this.healthText.text = healthText;
	}
}