interface IUserToken {
	username: string;
	userId: string;
}

interface IUserSession {
  username: string;
  name: string;
  token: string;
}

export {
	IUserToken,
  IUserSession,
}