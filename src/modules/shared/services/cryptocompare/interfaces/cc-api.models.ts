interface ICommonResponse {
	Response: String;
	Message: String;
	HasWarning: Boolean;
	Type: Number;
	RateLimit: Object;
}

interface IPair {
	exchange: String;
	exchange_fsym: String;
	exchange_tsym: String;
	fsym: String;
	tsym: String;
	last_update: Number;
}

interface IAllExchanges extends ICommonResponse{
	Data: Object;
}

interface IPairs extends ICommonResponse {
	Data: {	
		current: Array<IPair>;
		historical: Array<any>;
	}
}

interface IPrices extends ICommonResponse {
	Data: {
		Aggregated: boolean;
		TimeFrom: number;
		TimeTo: number;
		Data: Array<IPrice>
	}
}

interface IPrice {
	time: number;
	close: number;
	high: number;
	low: number;
	open: number;
	volumefrom: number;
	volumeto: number;
	conversionType: string;
	conversionSymbol: string;
}

interface IExchange {
	Id: String;
	Name: String;
	Url: String;
	LogoUrl: String;
	ItemType: [];
	CentralizationType: String;
	InternalName: String;
	GradePoints: Number;
	Grade: String;
	GradePointsSplit: Object
	AffiliateURL: String;
	Country: String;
	OrderBook: Boolean;
	Trades: Boolean;
	Description: String;
	FullAddress: String;
	Fees: String;
	DepositMethods: String;
	WithdrawalMethods: String;
	Sponsored: Boolean;
	Recommended: Boolean;
	Rating: Object;
	SortOrder: Number;
	TOTALVOLUME24H: Object
	DISPLAYTOTALVOLUME24H: Object
}

interface IPriceSingle {
  USD: number;
  JPY: number;
  EUR: number;
}

export {
	IAllExchanges,
	IExchange,
	IPairs,
	IPair,
	IPrices,
	IPrice,
  IPriceSingle
}