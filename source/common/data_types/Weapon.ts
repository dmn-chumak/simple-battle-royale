import { WeaponType } from "./WeaponType";

export interface Weapon
{
	attack: number;
	range: number;
	type: WeaponType;
	coolDownSec: number;
}