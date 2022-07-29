import { WeaponType } from "./WeaponType";

export interface Weapon
{
	attack: number;
	range: number;
	angleDeg: number;
	type: WeaponType;

	coolDownSec: number;
	isCoolDown?: boolean;
}