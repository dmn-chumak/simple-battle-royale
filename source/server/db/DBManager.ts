import { User } from "./models/User";

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
					console.log("[LOGIN]: Access allowed");
					return checkUser;
				}
				else
				{
					console.log(`[LOGIN]: Access denied!`);
					return null;
				}
			}
			else
			{
				console.log("[LOGIN]: Unregistered, registering");
				const newUser = await User.create({ userId, password: pass });
				return newUser;
			}
		}
		catch
		{
			// Something went wrong
			return null;
		}
	}
}