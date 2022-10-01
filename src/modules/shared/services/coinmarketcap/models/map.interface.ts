interface IMapAsset {
	id: number;
	name: string;
	symbol: string;
	slug: string;
	rank: number
	is_active: number
	first_historical_data: string;
	last_historical_data: string;
	platform: string | null;
}

interface IMapExchange {
	id: number;
	name: string;
	slug: string;
	is_active: number;
	first_historical_data: string;
	last_historical_data: string;
}

enum EMapType {
	EXCHANGE = 'exchange',
	ASSET = 'asset'
}

export {
	IMapAsset,
	IMapExchange,
	EMapType
}