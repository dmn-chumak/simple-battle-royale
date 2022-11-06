import { Match } from "./models/Match";
import { User } from "./models/User";
import { UsersMatch } from "./models/UsersMatch";

export class DBManager
{
	public async login(userId: string, pass: string): Promise<User>
	{
		try
		{
			const checkUser = await User.findByPk(userId);
			if (checkUser)
			{
				if (checkUser.password === pass)
				{
					// Access allowed
					return checkUser;
				}
				else
				{
					// Access denied!
					return null;
				}
			}
			else
			{
				// Unregistered, registering
				const newUser = await User.create({userId, password: pass});
				return newUser;
			}
		}
		catch
		{
			// Something went wrong
			return null;
		}
	}

	public async createMatch(users: string[]): Promise<Match>
	{
		const newMatch = await Match.create({});
		for (let index in users)
		{
			await UsersMatch.create({userId: users[index], matchId: newMatch.matchId});
		}
		return newMatch;
	}
}