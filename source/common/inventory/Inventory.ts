import { IItemData } from "./IItemData";
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

	public AddItem(item: IItemData): void
	{
		for (let i = 0; i < this.slotsQuantity; i++)
		{
			if (this.slots[i].IsEmpty())
			{
				this.slots[i].AddItem(item);
				break;
			}
			else
			{
				//inventory is full
			}

		}
	}

	public RemoveItem(slotID: number): void
	{
		this.slots[slotID].RemoveItem();
	}

}