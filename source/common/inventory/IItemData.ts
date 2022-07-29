import { ItemType } from "../data_types/ItemType";

export interface IItemData
{
	type:ItemType;
	name:string;
	isEquipable:boolean;
}