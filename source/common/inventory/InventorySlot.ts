import { IItemData } from "../data_types/IItemData";

export class InventorySlot
{
	protected _id: number;
	protected _isEmpty: boolean;
	protected _item: IItemData;

	constructor(id: number)
	{
		this._id = id;
		this._isEmpty = true;
	}

	public addItem(newItem: IItemData): void
	{
		this._item = newItem;
		this._isEmpty = false;
	}

	public removeItem(): void
	{
		this._item = null;
		this._isEmpty = true;
	}

	public get isEmpty(): boolean
	{
		return this._isEmpty;
	}
}
