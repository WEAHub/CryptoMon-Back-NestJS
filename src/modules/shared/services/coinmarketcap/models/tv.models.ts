interface ITradingViewSentimentRequest {
	data: ITradingViewSentiment
}

interface ITradingViewSentiment {
	totalCount: number;
	data: ITradingViewSentimentData[]
}

interface ITradingViewSentimentData {
	d: number[];
	s: string;
}

export {
	ITradingViewSentimentRequest
}