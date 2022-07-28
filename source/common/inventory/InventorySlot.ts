import { IItemData } from "./IItemData";

export class InventorySlot
{
	protected id: number;
	protected isEmpty: boolean;
	protected item: IItemData;

	constructor(id: number)
	{
		this.id = id;
		this.isEmpty = true;
	}

	public AddItem(newItem: IItemData): void
	{
		this.item = newItem;
		this.isEmpty = false;
	}

	public RemoveItem(): void
	{
		this.item = null;
		this.isEmpty = true;
	}

	public IsEmpty(): boolean
	{
		return this.isEmpty;
	}

}