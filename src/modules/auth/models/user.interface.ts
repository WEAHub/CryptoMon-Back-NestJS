interface IUser {
	username: string;
	userId: string;
}

interface IUserDB {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

export {
	IUser,
	IUserDB
}