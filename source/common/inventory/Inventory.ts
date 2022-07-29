import { IItemData } from "../data_types/IItemData";
import { InventorySlot } from "./InventorySlot";

export class Inventory
{
	slotsQuantity: number;
	slots: InventorySlot[];

	constructor(slotsQuantity: number)
	{
		this.slotsQuantity = slotsQuantity;
		this.createInventorySlots();
	}

	protected createInventorySlots()
	{
		for (let i = 0; i < this.slotsQuantity; i++)
		{
			this.slots[i] = new InventorySlot(i);
		}
	}

	public addItem(item: IItemData): void
	{
		for (let i = 0; i < this.slotsQuantity; i++)
		{
			if (this.slots[i].isEmpty)
			{
				this.slots[i].addItem(item);
				break;
			}
			else
			{
				//inventory is full
			}
		}
	}

	public removeItem(slotID: number): void
	{
		this.slots[slotID].removeItem();
	}
}
