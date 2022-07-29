export enum PlayerType
{
	DRINKER = "drinker",
	GUARD = "guard",
	WARRIOR_GIRL = "warriorGirl"
}

let values: string[];

export function getRandomPlayer(): PlayerType
{
	if (!values)
	{
		values = Object.values(PlayerType);
	}
	const randomElement: number = Math.floor(Math.random() * values.length);
	return values[randomElement] as PlayerType;
}