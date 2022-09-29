interface IResponse {
	message: EResponses
}

enum EResponses {
	SUCCESS = 'success',
	ERROR = 'error'
}

export {
	IResponse,
	EResponses
}