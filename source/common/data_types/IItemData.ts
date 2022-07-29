import { ItemType } from "./ItemType";

export interface IItemData
{
    type: ItemType;
    quantity: number;
    isEquipable: boolean;
}
