import { Weapon } from "./data_types/Weapon";
import { WeaponType } from "./data_types/WeaponType";
import { PLAYER_RADIUS } from "./GameConfig";

export const WEAPON_FIST: Weapon = {
	attack: 3,
	range: PLAYER_RADIUS + 0.15,
	angleDeg: 90,

	type: WeaponType.MELEE,
	coolDownSec: 1
};

export function cloneNewWeapon(weapon: Weapon): Weapon
{
	return {
		attack: weapon.attack,
		range: weapon.range,
		angleDeg: weapon.angleDeg,

		type: weapon.type,

		coolDownSec: weapon.coolDownSec
	};
}