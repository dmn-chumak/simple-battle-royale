import { Graphics } from "pixi.js";
import { Container } from "pixi.js";
import { PIXELS_IN_METER } from "../../common/GameConfig";
import { PLAYER_RADIUS } from "../../common/GameConfig";

export class PlayerView extends Container
{
	public constructor(color: number)
	{
		super();

		const circle = new Graphics();
		circle.beginFill(color);
		circle.drawCircle(0, 0, PLAYER_RADIUS * PIXELS_IN_METER);
		circle.endFill();
		this.addChild(circle);
	}
}
