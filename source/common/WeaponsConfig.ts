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