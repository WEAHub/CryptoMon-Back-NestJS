interface ListingLatest {
	data: ListingAsset[]
}

interface ListingAsset {
	id: number;
	name: string;
	symbol: string;
	slug: string;
	cmc_rank: number;
	num_market_pairs: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	last_updated: Date;
	date_added: Date;
	tags: string[];
	platform: string | null;
	self_reported_circulating_supply: string | null;
	self_reported_market_cap: string | null;
	quote: {
		USD: ListingAssetQuote;
		BTC: ListingAssetQuote;
	};
}

interface ListingAssetQuote {
	price: number;
	volume_24h: number;
	volume_change_24h: number;
	percent_change_1h: number;
	percent_change_24h: number;
	percent_change_7d: number;
	market_cap: number;
	market_cap_dominance: number;
	fully_diluted_market_cap: number;
	last_updated: Date;
}

export {
	ListingLatest,
	ListingAsset,
	ListingAssetQuote
}