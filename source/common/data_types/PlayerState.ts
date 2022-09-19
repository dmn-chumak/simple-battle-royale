import { PlayerType } from "./PlayerType";
import { Weapon } from "./Weapon";

export interface PlayerState
{
	type: PlayerType;
	rotation: number;
	x: number;
	y: number;
	z: number;

	currHP: number;
	maxHP: number;
	isAlive: boolean;

	currWeapon: Weapon;
}
