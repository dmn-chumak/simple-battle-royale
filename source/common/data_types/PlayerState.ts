import { Weapon } from "./Weapon";

export interface PlayerState
{
	color: number;
	x: number;
	y: number;
	z: number;

	currHP: number;
	maxHP: number;
	isAlive: boolean;

	currWeapon: Weapon;
}
