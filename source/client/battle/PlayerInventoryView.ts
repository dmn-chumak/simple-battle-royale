import { Text } from "pixi.js";
import { Graphics } from "pixi.js";
import { Container } from "pixi.js";

export interface IItemData
{
	id: number;
	name: string;
	quantity: number;
	icon: string;
}

export class PlayerInventoryView extends Container
{
	protected _isShown: boolean;
	protected _inventoryContainer: Container;
	protected _inventoryItemsContainer: Container;
	protected _invRect: Graphics;
	protected _items: IItemData[];

	constructor()
	{
		super();

		this._isShown = false;
		this.createBoard();
		this._inventoryContainer.alpha = 0;

		document.body.addEventListener("keydown", this.toggleVisiblity.bind(this));

		this._items = [
			{ id: 0, name: "Wood", quantity: 1, icon: "" },
			{ id: 1, name: "Metal", quantity: 2, icon: "" },
			{ id: 2, name: "Ball", quantity: 2, icon: "" },
			{ id: 3, name: "Car", quantity: 2, icon: "" },
			{ id: 4, name: "Arse", quantity: 0, icon: "" },
			{ id: 5, name: "Horse", quantity: 0, icon: "" },
		]
	}

	public toggleVisiblity(event: KeyboardEvent): void
	{
		if (event.code === "KeyI")
		{
			if (this._isShown)
			{
				this._isShown = false;
				this._inventoryContainer.alpha = 0;
			}
			else
			{
				this._isShown = true;
				this._inventoryContainer.alpha = 0.5;
				this.resize();
				this.updateView();
			}
		}
	}

	public resize(): void
	{
		this._invRect.width = window.innerWidth / 2;
		this._invRect.height = window.innerHeight / 2;
		this.updateView();
	}

	public updateData(items: IItemData[]): void
	{
		this._items = items;
	}

	protected updateView(): void
	{
		this._inventoryItemsContainer.removeChildren();
		let x = window.innerWidth / 4 + 20;
		let y = window.innerHeight / 4 + 20;
		for (const item of this._items)
		{
			const name: Text = new Text(item.name);
			name.position.x = x + 10;
			name.position.y = y;
			this._inventoryItemsContainer.addChild(name);

			const quantity: Text = new Text(item.quantity);
			quantity.position.x = x + 100;
			quantity.position.y = y;
			this._inventoryItemsContainer.addChild(quantity);

			y += 30;
		}
	}

	protected createBoard(): void
	{
		this._inventoryContainer = new Container();

		this._invRect = new Graphics();
		this._invRect.beginFill(0x008800, 1);
		this._invRect.drawRect(window.innerWidth / 4, window.innerHeight / 4, window.innerWidth / 2, window.innerHeight / 2);
		this._invRect.endFill();

		this._inventoryContainer.addChild(this._invRect);

		this._inventoryItemsContainer = new Container();
		this._inventoryContainer.addChild(this._inventoryItemsContainer);

		this.addChild(this._inventoryContainer);
	}
}
